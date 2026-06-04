package com.example.trymlkit.ui.screens

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.media.ExifInterface
import android.net.Uri
import android.util.Log
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.trymlkit.utils.FaceEmbeddingUtils
import com.example.trymlkit.viewmodel.MainViewModel
import com.google.firebase.firestore.FirebaseFirestore
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddProfileScreen(navController: NavController, viewModel: MainViewModel) {
    val context = LocalContext.current
    var name by remember { mutableStateOf("") }
    var grade by remember { mutableStateOf("") }
    var room by remember { mutableStateOf("") }
    var bitmap by remember { mutableStateOf<Bitmap?>(null) }
    var isUploading by remember { mutableStateOf(false) }
    
    val faceEmbeddingUtils = remember { FaceEmbeddingUtils(context) }

    val launcher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            try {
                val input = context.contentResolver.openInputStream(it)
                val original = BitmapFactory.decodeStream(input)
                bitmap = rotateImageIfRequired(context, original, it)
            } catch (e: Exception) {
                Toast.makeText(context, "Image load failed", Toast.LENGTH_SHORT).show()
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Add Student Profile", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding).padding(24.dp).verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally) {
            Box(modifier = Modifier.size(140.dp).clip(CircleShape).background(Color(0xFFF1F5F9))
                .border(2.dp, Color(0xFFE2E8F0), CircleShape).clickable { launcher.launch("image/*") },
                contentAlignment = Alignment.Center) {
                if (bitmap != null) {
                    Image(bitmap = bitmap!!.asImageBitmap(), contentDescription = null, modifier = Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
                } else {
                    Icon(Icons.Default.CameraAlt, null, tint = Color(0xFF64748B))
                }
            }
            Spacer(Modifier.height(32.dp))
            OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Full Name") }, modifier = Modifier.fillMaxWidth())
            Spacer(Modifier.height(16.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                OutlinedTextField(value = grade, onValueChange = { grade = it }, label = { Text("Grade") }, modifier = Modifier.weight(1f))
                OutlinedTextField(value = room, onValueChange = { room = it }, label = { Text("Room") }, modifier = Modifier.weight(1f))
            }
            Spacer(Modifier.height(40.dp))
            Button(onClick = {
                if (name.isNotEmpty() && bitmap != null) {
                    isUploading = true
                    processAndUpload(context, name, grade, room, bitmap!!, faceEmbeddingUtils) {
                        isUploading = false
                        if (it) navController.popBackStack()
                    }
                }
            }, modifier = Modifier.fillMaxWidth().height(56.dp), enabled = !isUploading) {
                if (isUploading) CircularProgressIndicator(color = Color.White) else Text("Save Profile")
            }
        }
    }
}

private fun rotateImageIfRequired(context: android.content.Context, img: Bitmap, uri: Uri): Bitmap {
    val input = context.contentResolver.openInputStream(uri) ?: return img
    val ei = ExifInterface(input)
    val orientation = ei.getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL)
    val matrix = Matrix()
    when (orientation) {
        ExifInterface.ORIENTATION_ROTATE_90 -> matrix.postRotate(90f)
        ExifInterface.ORIENTATION_ROTATE_180 -> matrix.postRotate(180f)
        ExifInterface.ORIENTATION_ROTATE_270 -> matrix.postRotate(270f)
        else -> return img
    }
    return Bitmap.createBitmap(img, 0, 0, img.width, img.height, matrix, true)
}

private fun processAndUpload(context: android.content.Context, name: String, grade: String, room: String, bitmap: Bitmap, utils: FaceEmbeddingUtils, onComplete: (Boolean) -> Unit) {
    val detector = FaceDetection.getClient(FaceDetectorOptions.Builder().setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE).build())
    detector.process(InputImage.fromBitmap(bitmap, 0))
        .addOnSuccessListener { faces ->
            if (faces.isNotEmpty()) {
                try {
                    val face = faces[0]
                    val box = face.boundingBox
                    
                    // 统一使用正方形裁剪，增加 20% 边距
                    val maxDim = maxOf(box.width(), box.height())
                    val size = (maxDim * 1.4f).toInt() // 1.4 倍包含部分头部
                    
                    val centerX = box.centerX()
                    val centerY = box.centerY()
                    
                    val left = (centerX - size/2).coerceIn(0, bitmap.width - 1)
                    val top = (centerY - size/2).coerceIn(0, bitmap.height - 1)
                    val actualWidth = size.coerceAtMost(bitmap.width - left)
                    val actualHeight = size.coerceAtMost(bitmap.height - top)
                    
                    val faceBitmap = Bitmap.createBitmap(bitmap, left, top, actualWidth, actualHeight)
                    val embedding = utils.getEmbedding(faceBitmap)
                    
                    val studentData = hashMapOf(
                        "name" to name, "grade" to grade, "room" to room,
                        "faceVector" to embedding.toList(), "timestamp" to System.currentTimeMillis()
                    )

                    FirebaseFirestore.getInstance().collection("students").add(studentData)
                        .addOnSuccessListener { onComplete(true) }
                        .addOnFailureListener { onComplete(false) }
                } catch (e: Exception) {
                    Log.e("Upload", "Error: ${e.message}")
                    onComplete(false)
                }
            } else {
                Toast.makeText(context, "No face found!", Toast.LENGTH_SHORT).show()
                onComplete(false)
            }
        }
}
