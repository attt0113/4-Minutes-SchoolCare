package com.example.trymlkit.utils

import android.content.Context
import android.graphics.Bitmap
import android.util.Log
import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.math.sqrt
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.support.common.FileUtil

class FaceEmbeddingUtils(context: Context) {
    private var interpreter: Interpreter? = null
    private val modelFileName = "mobile_facenet.tflite"
    private val inputSize = 112

    init {
        try {
            val model = FileUtil.loadMappedFile(context, modelFileName)
            val options = Interpreter.Options().setNumThreads(4)
            interpreter = Interpreter(model, options)
            Log.d("FaceEmbeddingUtils", "Model Loaded. Input shape: ${interpreter?.getInputTensor(0)?.shape()?.contentToString()}")
        } catch (e: Exception) {
            Log.e("FaceEmbeddingUtils", "Model load error: ${e.message}")
        }
    }

    fun getEmbedding(faceBitmap: Bitmap): FloatArray {
        val interpreter = this.interpreter ?: throw IllegalStateException("TFLite not ready")

        // 1. Resize to 112x112 with bilinear filtering
        val resizedBitmap = Bitmap.createScaledBitmap(faceBitmap, inputSize, inputSize, true)

        // 2. Convert to RGB Float Buffer
        val imgData = ByteBuffer.allocateDirect(1 * inputSize * inputSize * 3 * 4)
        imgData.order(ByteOrder.nativeOrder())
        imgData.rewind()

        val intValues = IntArray(inputSize * inputSize)
        resizedBitmap.getPixels(intValues, 0, inputSize, 0, 0, inputSize, inputSize)

        for (pixel in intValues) {
            val r = (pixel shr 16 and 0xFF)
            val g = (pixel shr 8 and 0xFF)
            val b = (pixel and 0xFF)
            
            // Standard MobileFaceNet normalization: [-1, 1]
            imgData.putFloat((r - 127.5f) / 127.5f)
            imgData.putFloat((g - 127.5f) / 127.5f)
            imgData.putFloat((b - 127.5f) / 127.5f)
        }
        imgData.rewind()

        val outputTensor = interpreter.getOutputTensor(0)
        val outputShape = outputTensor.shape()
        val featureCount = outputShape[outputShape.size - 1]
        val output = Array(1) { FloatArray(featureCount) }

        interpreter.run(imgData, output)

        // 5. Return L2 Normalized vector
        return l2Normalize(output[0])
    }

    private fun l2Normalize(v: FloatArray): FloatArray {
        var sum = 0.0f
        for (f in v) sum += f * f
        val mag = sqrt(sum)
        if (mag < 1e-6) return v
        for (i in v.indices) v[i] = v[i] / mag
        return v
    }

    // Cosine Similarity: 1.0 is identical, 0.0 is orthogonal. 
    // Higher is more similar. For MobileFaceNet, > 0.4-0.5 is usually a match.
    fun calculateCosineSimilarity(v1: FloatArray, v2: FloatArray): Float {
        if (v1.size != v2.size || v1.isEmpty()) return 0f
        var dotProduct = 0.0f
        for (i in v1.indices) {
            dotProduct += v1[i] * v2[i]
        }
        return dotProduct
    }

    // Euclidean Distance: Smaller is more similar.
    fun calculateDistance(v1: FloatArray, v2: FloatArray): Float {
        if (v1.size != v2.size || v1.isEmpty()) return Float.MAX_VALUE
        var sum = 0.0f
        for (i in v1.indices) {
            val diff = v1[i] - v2[i]
            sum += diff * diff
        }
        return sqrt(sum)
    }
}
