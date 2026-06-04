package com.example.trymlkit

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.RectF
import android.util.AttributeSet
import android.view.View
import com.google.mlkit.vision.face.Face
import com.google.mlkit.vision.face.FaceLandmark

class FaceOverlayView(context: Context, attrs: AttributeSet?) : View(context, attrs) {

    private val faces = mutableListOf<Face>()
    private var imageWidth = 0
    private var imageHeight = 0
    private var scaleX = 1f
    private var scaleY = 1f

    // 1️⃣ 准备画笔
    private val boxPaint = Paint().apply {
        color = Color.RED
        style = Paint.Style.STROKE
        strokeWidth = 6f
    }
    private val landmarkPaint = Paint().apply {
        color = Color.BLUE
        style = Paint.Style.FILL
        strokeWidth = 10f
    }

    // 2️⃣ 核心方法：更新人脸数据和图片尺寸
    fun setFaces(newFaces: List<Face>, width: Int, height: Int) {
        faces.clear()
        faces.addAll(newFaces)
        this.imageWidth = width
        this.imageHeight = height
        // 在绘制前计算缩放比例
        calculateScales()
        // 强制重绘
        invalidate()
    }

    // 3️⃣ 计算缩放比例：将 ML Kit 的坐标转换为屏幕坐标
    private fun calculateScales() {
        if (imageWidth == 0 || imageHeight == 0 || width == 0 || height == 0) return

        // 由于相机通常是旋转的（后置摄像头是 90 度或 270 度），
        // 我们需要根据相机的旋转角度来确定是宽对宽，还是宽对高。
        // 这里假设是后置摄像头，且是竖屏使用。
        scaleX = width.toFloat() / imageHeight.toFloat()
        scaleY = height.toFloat() / imageWidth.toFloat()
    }

    // 4️⃣ 核心方法：执行绘制逻辑
    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        for (face in faces) {
            // A. 画人脸框
            val boundingBox = face.boundingBox
            val rectF = translateRect(boundingBox)
            canvas.drawRect(rectF, boxPaint)

            // B. 画特征点
            drawLandmark(canvas, face, FaceLandmark.LEFT_EYE)
            drawLandmark(canvas, face, FaceLandmark.RIGHT_EYE)
            drawLandmark(canvas, face, FaceLandmark.NOSE_BASE)
            drawLandmark(canvas, face, FaceLandmark.MOUTH_LEFT)
            drawLandmark(canvas, face, FaceLandmark.MOUTH_RIGHT)
        }
    }

    // 将 ML Kit 的坐标转换为屏幕坐标
    // FaceOverlayView.kt

    // 将 ML Kit 的坐标转换为屏幕坐标
    private fun translateRect(rect: Rect): RectF {
        // 🔙 针对后置摄像头 + 竖屏持握的修正公式
        // 因为红框偏右下，我们需要：
        // 1. 将原有的 left 坐标向左移（减小）
        // 2. 将原有的 top 坐标向上移（减小）

        // 原始错误的公式：
        // val left = width - (rect.bottom * scaleX)
        // val top = rect.left * scaleY
        // val right = width - (rect.top * scaleX)
        // val bottom = rect.right * scaleY

        // 修正后的公式（假设 90 度旋转）：
        val left = rect.left * scaleX
        val top = rect.top * scaleY
        val right = rect.right * scaleX
        val bottom = rect.bottom * scaleY

        return RectF(left, top, right, bottom)
    }

    private fun drawLandmark(canvas: Canvas, face: Face, landmarkType: Int) {
        face.getLandmark(landmarkType)?.position?.let { pos ->
            // 🔙 针对后置摄像头 + 竖屏持握的修正公式

            // 原始错误的公式：
            // val x = width - (pos.y * scaleX)
            // val y = pos.x * scaleY

            // 修正后的公式（假设 90 度旋转）：
            val x = pos.x * scaleX
            val y = pos.y * scaleY
            canvas.drawCircle(x, y, 10f, landmarkPaint)
        }
    }
}