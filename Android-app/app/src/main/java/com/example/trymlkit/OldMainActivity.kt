package com.example.trymlkit

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.TextView
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import com.google.android.material.bottomsheet.BottomSheetBehavior
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.Face
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class OldMainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var cameraContainer: View
    private lateinit var previewView: PreviewView
    private lateinit var faceOverlayView: FaceOverlayView
    private lateinit var resultSummary: TextView
    private lateinit var resultDetail: TextView
    private lateinit var statusIndicator: TextView
    private lateinit var cameraExecutor: ExecutorService
    private lateinit var bottomSheetBehavior: BottomSheetBehavior<View>

    private var isLocked = false
    private val scanHistory = mutableListOf<Float>()
    private var faceDetectedStartTime: Long = 0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)

        // 1. 初始化所有视图
        webView = findViewById(R.id.webView)
        cameraContainer = findViewById(R.id.cameraContainer)
        previewView = findViewById(R.id.previewView)
        faceOverlayView = findViewById(R.id.faceOverlayView)
        resultSummary = findViewById(R.id.resultSummary)
        resultDetail = findViewById(R.id.resultDetail)
        statusIndicator = findViewById(R.id.statusIndicator)

        val sheet: View = findViewById(R.id.bottomSheet)
        bottomSheetBehavior = BottomSheetBehavior.from(sheet)
        bottomSheetBehavior.state = BottomSheetBehavior.STATE_HIDDEN // 初始隐藏

        // 2. 配置 WebView
        setupWebView()

        // 3. 配置重置/关闭按钮
        findViewById<Button>(R.id.resetButton).setOnClickListener {
            hideCameraAndShowWeb()
        }

        cameraExecutor = Executors.newSingleThreadExecutor()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.javaScriptEnabled = true
        webView.settings.domStorageEnabled = true // 必须，为了 localStorage

        // 关键：这行代码保证点击网页里的链接时，依然在 App 内打开
        webView.webViewClient = object : android.webkit.WebViewClient() {
            override fun shouldOverrideUrlLoading(view: android.webkit.WebView?, url: String?): Boolean {
                return false // 返回 false 表示由 WebView 自己处理跳转
            }
        }

        webView.addJavascriptInterface(object {
            @android.webkit.JavascriptInterface
            fun startAIScan() {
                runOnUiThread { showCameraAndStart() }
            }
        }, "Android")

        webView.loadUrl("file:///android_asset/health-care-main/index.html")
    }

    fun showCameraAndStart() {
        cameraContainer.visibility = View.VISIBLE
        webView.visibility = View.GONE
        isLocked = false
        faceDetectedStartTime = 0
        scanHistory.clear()
        startCamera()
    }

    private fun hideCameraAndShowWeb() {
        cameraContainer.visibility = View.GONE
        webView.visibility = View.VISIBLE

        // 🎯 核心改动：回到网页时彻底隐藏详情页
        bottomSheetBehavior.peekHeight = 0
        bottomSheetBehavior.state = BottomSheetBehavior.STATE_HIDDEN
    }

    // --- 相机与 AI 逻辑 (保持之前的稳定版) ---

    private fun startCamera() {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(this)
        cameraProviderFuture.addListener({
            val cameraProvider = cameraProviderFuture.get()
            val preview = androidx.camera.core.Preview.Builder().build().also {
                it.setSurfaceProvider(previewView.surfaceProvider)
            }
            val imageAnalysis = ImageAnalysis.Builder()
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build()
            imageAnalysis.setAnalyzer(cameraExecutor) { processImageProxy(it) }

            try {
                cameraProvider.unbindAll()
                cameraProvider.bindToLifecycle(this, CameraSelector.DEFAULT_BACK_CAMERA, preview, imageAnalysis)
            } catch (e: Exception) {
                Log.e("Camera", "Binding failed", e)
            }
        }, ContextCompat.getMainExecutor(this))
    }

    @SuppressLint("UnsafeOptInUsageError")
    private fun processImageProxy(imageProxy: ImageProxy) {
        if (isLocked) {
            imageProxy.close()
            return
        }

        val mediaImage = imageProxy.image ?: return
        val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)

        val options = FaceDetectorOptions.Builder()
            .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
            .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL)
            .build()

        FaceDetection.getClient(options).process(image)
            .addOnSuccessListener { faces ->
                val primaryFace = faces.maxByOrNull { it.boundingBox.width() * it.boundingBox.height() }
                runOnUiThread {
                    if (primaryFace != null) {
                        handleFaceDetection(primaryFace, imageProxy)
                    } else {
                        statusIndicator.text = "请对准人脸"
                        faceOverlayView.setFaces(emptyList(), imageProxy.width, imageProxy.height)
                    }
                }
            }
            .addOnCompleteListener { imageProxy.close() }
    }

    private fun handleFaceDetection(face: Face, proxy: ImageProxy) {
        if (faceDetectedStartTime == 0L) faceDetectedStartTime = System.currentTimeMillis()

        val discomfort = (1 - (face.smilingProbability ?: 0f)) * 0.4f + (1 - ((face.leftEyeOpenProbability ?: 0f) + (face.rightEyeOpenProbability ?: 0f)) / 2f) * 0.6f
        scanHistory.add(discomfort)

        faceOverlayView.setFaces(listOf(face), proxy.width, proxy.height)

        val timePassed = System.currentTimeMillis() - faceDetectedStartTime
        statusIndicator.text = "正在分析: ${(timePassed/1000)}s"

        if (timePassed > 3000) { // 识别3秒后自动定格
            lockAndShowResult()
        }
    }

    private fun lockAndShowResult() {
        isLocked = true
        val avg = scanHistory.average().toFloat()
        runOnUiThread {
            statusIndicator.text = "分析完成"
            resultSummary.text = "不适概率: ${(avg * 100).toInt()}%"
            resultDetail.text = "经过3秒多帧扫描，该学生状态${if(avg > 0.5) "可能存在不适" else "正常"}。"

            // 🎯 核心改动：在这里才让它浮现出来
            bottomSheetBehavior.state = BottomSheetBehavior.STATE_COLLAPSED
            // 此时它会弹出约 100dp-200dp 的高度，提示用户可以往上拉
            bottomSheetBehavior.peekHeight = 400 // 这里设置弹出后的预览高度
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        cameraExecutor.shutdown()
    }
}
