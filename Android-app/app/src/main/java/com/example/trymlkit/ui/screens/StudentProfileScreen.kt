package com.example.trymlkit.ui.screens

import android.graphics.Bitmap
import android.graphics.Matrix
import android.util.Log
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.animation.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.navigation.NavController
import com.example.trymlkit.utils.FaceEmbeddingUtils
import com.google.firebase.firestore.FirebaseFirestore
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import com.google.ai.client.generativeai.GenerativeModel
import kotlinx.coroutines.launch
import java.util.concurrent.Executors

private val bgLight = Color(0xFFF8FAFC)
private val brandBlue = Color(0xFF1D61E7)
private val textDark = Color(0xFF0F172A)
private val textGray = Color(0xFF64748B)

@Composable
fun StudentProfileScreen(navController: NavController, fromLevel: String) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val scope = rememberCoroutineScope()
    val scrollState = rememberScrollState()

    val faceDetector = remember {
        FaceDetection.getClient(
            FaceDetectorOptions.Builder()
                .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
                .setClassificationMode(FaceDetectorOptions.CLASSIFICATION_MODE_ALL)
                .build()
        )
    }
    val faceEmbeddingUtils = remember { FaceEmbeddingUtils(context) }
    val cameraExecutor = remember { Executors.newSingleThreadExecutor() }

    val studentsInDb = remember { mutableStateListOf<Map<String, Any>>() }
    var scanningStatus by remember { mutableStateOf("READY TO SCAN") }
    var analysisComplete by remember { mutableStateOf(false) }
    var selectionRequired by remember { mutableStateOf(false) }
    
    var selectedStudent by remember { mutableStateOf<Map<String, Any>?>(null) }
    var illnessProbability by remember { mutableIntStateOf(0) }
    
    // Metrics Accumulators
    var smileAccumulator by remember { mutableFloatStateOf(0f) }
    var alertnessAccumulator by remember { mutableFloatStateOf(0f) }
    var validFramesCount by remember { mutableIntStateOf(0) }
    var isDataExpanded by remember { mutableStateOf(false) }

    // Final result metrics
    var finalSmileAvg by remember { mutableFloatStateOf(0f) }
    var finalAlertnessAvg by remember { mutableFloatStateOf(0f) }

    // AI result state
    var aiSteps by remember { mutableStateOf<List<String>>(emptyList()) }
    var isAiLoading by remember { mutableStateOf(false) }

    var topMatches by remember { mutableStateOf<List<Pair<Map<String, Any>, Float>>>(emptyList()) }

    var blinkCount by remember { mutableIntStateOf(0) }
    var lastLeftEyeOpen by remember { mutableStateOf(true) }
    var analysisStartTime by remember { mutableLongStateOf(0L) }
    var aiCalled by remember { mutableStateOf(false) }

    val generativeModel = remember { 
        GenerativeModel(
            modelName = "gemini-3.1-flash-lite-preview", 
            apiKey = "Hidden" 
        ) 
    }

    LaunchedEffect(Unit) {
        FirebaseFirestore.getInstance().collection("students").get().addOnSuccessListener { result ->
            studentsInDb.clear()
            for (document in result) studentsInDb.add(document.data)
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(Color.Black)) {
        AndroidView(
            factory = { ctx -> PreviewView(ctx).apply { implementationMode = PreviewView.ImplementationMode.COMPATIBLE } },
            modifier = Modifier.fillMaxSize(),
            update = { previewView ->
                val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
                cameraProviderFuture.addListener({
                    val cameraProvider = cameraProviderFuture.get()
                    val preview = Preview.Builder().build().also { it.setSurfaceProvider(previewView.surfaceProvider) }
                    val imageAnalysis = ImageAnalysis.Builder()
                        .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                        .build()

                    imageAnalysis.setAnalyzer(cameraExecutor) { imageProxy ->
                        if (analysisComplete) { imageProxy.close(); return@setAnalyzer }
                        try {
                            val rotation = imageProxy.imageInfo.rotationDegrees
                            val rawBitmap = imageProxy.toBitmap()
                            val matrix = Matrix().apply { postRotate(rotation.toFloat()) }
                            val fullBitmap = Bitmap.createBitmap(rawBitmap, 0, 0, rawBitmap.width, rawBitmap.height, matrix, true)
                            val image = InputImage.fromBitmap(fullBitmap, 0)

                            faceDetector.process(image).addOnSuccessListener { faces ->
                                val primaryFace = faces.maxByOrNull { it.boundingBox.width() * it.boundingBox.height() }
                                if (primaryFace != null) {
                                    val s = primaryFace.smilingProbability
                                    val l = primaryFace.leftEyeOpenProbability
                                    val r = primaryFace.rightEyeOpenProbability
                                    if (s != null && l != null && r != null) {
                                        smileAccumulator += s
                                        alertnessAccumulator += (l + r) / 2f
                                        validFramesCount++
                                    }

                                    val box = primaryFace.boundingBox
                                    val size = (maxOf(box.width(), box.height()) * 1.4f).toInt() 
                                    val centerX = box.centerX()
                                    val centerY = box.centerY()
                                    val left = (centerX - size/2).coerceIn(0, fullBitmap.width - 1)
                                    val top = (centerY - size/2).coerceIn(0, fullBitmap.height - 1)
                                    val actualWidth = minOf(size, fullBitmap.width - left)
                                    val actualHeight = minOf(size, fullBitmap.height - top)

                                    if (actualWidth > 60 && actualHeight > 60) {
                                        val faceCrop = Bitmap.createBitmap(fullBitmap, left, top, actualWidth, actualHeight)
                                        val currentEmbedding = faceEmbeddingUtils.getEmbedding(faceCrop)
                                        
                                        val currentScores = mutableListOf<Pair<Map<String, Any>, Float>>()
                                        for (student in studentsInDb) {
                                            val vector = (student["faceVector"] as? List<*>)?.mapNotNull { (it as? Number)?.toFloat() }?.toFloatArray()
                                            if (vector != null && vector.size == currentEmbedding.size) {
                                                val sim = faceEmbeddingUtils.calculateCosineSimilarity(currentEmbedding, vector)
                                                if (sim > 0.35f) { 
                                                    currentScores.add(student to sim)
                                                }
                                            }
                                        }
                                        topMatches = currentScores.sortedByDescending { it.second }.take(3)
                                    }

                                    if (analysisStartTime == 0L) analysisStartTime = System.currentTimeMillis()
                                    val timePassed = System.currentTimeMillis() - analysisStartTime
                                    scanningStatus = "ANALYZING: ${(timePassed / 1000)}s"

                                    val leftEyeOpen = (primaryFace.leftEyeOpenProbability ?: 1.0f) > 0.4f
                                    if (lastLeftEyeOpen && !leftEyeOpen) blinkCount++
                                    lastLeftEyeOpen = leftEyeOpen

                                    if (timePassed > 4000) {
                                        analysisComplete = true
                                        finalSmileAvg = if (validFramesCount > 0) smileAccumulator / validFramesCount else 0.5f
                                        finalAlertnessAvg = if (validFramesCount > 0) alertnessAccumulator / validFramesCount else 0.8f
                                        
                                        val baseRisk = 15
                                        val alertnessRisk = (1.0f - finalAlertnessAvg) * 50
                                        val smileRisk = (1.0f - finalSmileAvg) * 30
                                        val rawProb = (baseRisk + alertnessRisk + smileRisk).toInt()
                                        illnessProbability = ((rawProb + 5) / 10 * 10).coerceIn(10, 90)

                                        if (topMatches.isEmpty()) {
                                            selectedStudent = mapOf("name" to "Unknown Student")
                                        } else if (topMatches.size == 1) {
                                            selectedStudent = topMatches[0].first
                                        } else {
                                            selectionRequired = true
                                        }
                                    }
                                } else { scanningStatus = "ALIGN FACE" }
                            }
                            .addOnCompleteListener { imageProxy.close() }
                        } catch (e: Exception) { imageProxy.close() }
                    }
                    try {
                        cameraProvider.unbindAll()
                        cameraProvider.bindToLifecycle(lifecycleOwner, CameraSelector.DEFAULT_BACK_CAMERA, preview, imageAnalysis)
                    } catch (e: Exception) { Log.e("Camera", "Failed", e) }
                }, ContextCompat.getMainExecutor(context))
            }
        )

        // Viewfinder
        AnimatedVisibility(visible = !analysisComplete, enter = fadeIn(), exit = fadeOut()) {
            Column(modifier = Modifier.fillMaxSize().padding(top = 100.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Row(modifier = Modifier.fillMaxWidth(0.85f).height(180.dp), horizontalArrangement = Arrangement.SpaceBetween) { ViewfinderCorner(0f); ViewfinderCorner(90f) }
                Spacer(Modifier.height(40.dp))
                Surface(color = Color.Black.copy(alpha = 0.5f), shape = RoundedCornerShape(20.dp)) {
                    Text(scanningStatus, color = Color.White, modifier = Modifier.padding(16.dp), fontWeight = FontWeight.Bold)
                }
                Spacer(Modifier.height(40.dp))
                Row(modifier = Modifier.fillMaxWidth(0.85f), horizontalArrangement = Arrangement.SpaceBetween) { ViewfinderCorner(270f); ViewfinderCorner(180f) }
            }
        }

        // --- Selection Screen ---
        if (analysisComplete && selectionRequired && selectedStudent == null) {
            Surface(modifier = Modifier.fillMaxSize(), color = bgLight.copy(alpha = 0.95f)) {
                Column(modifier = Modifier.padding(24.dp).verticalScroll(rememberScrollState()), horizontalAlignment = Alignment.CenterHorizontally) {
                    Spacer(Modifier.height(60.dp))
                    Text("Identify Student", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = textDark)
                    Text("Select the closest match to continue.", fontSize = 14.sp, color = textGray)
                    Spacer(Modifier.height(32.dp))

                    topMatches.forEach { (student, score) ->
                        Card(
                            modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp).clickable { selectedStudent = student },
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            border = BorderStroke(1.dp, Color(0xFFE2E8F0))
                        ) {
                            Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                                Surface(modifier = Modifier.size(48.dp), shape = CircleShape, color = brandBlue.copy(alpha = 0.1f)) {
                                    Box(contentAlignment = Alignment.Center) { Icon(Icons.Default.Person, null, tint = brandBlue) }
                                }
                                Spacer(Modifier.width(16.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(student["name"] as? String ?: "Unknown", fontWeight = FontWeight.Bold, color = textDark)
                                    Text("Match Confidence: ${(score * 100).toInt()}%", fontSize = 12.sp, color = textGray)
                                }
                                Icon(Icons.Default.ChevronRight, null, tint = textGray)
                            }
                        }
                    }
                    
                    Spacer(Modifier.height(24.dp))
                    TextButton(onClick = { selectedStudent = mapOf("name" to "Unknown Student"); selectionRequired = false }) {
                        Text("Unidentified Student", color = brandBlue, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // --- Result Display ---
        val student = selectedStudent
        if (analysisComplete && student != null) {
            val studentName = student["name"] as? String ?: "Unknown Student"
            val grade = student["grade"] as? String ?: ""
            val room = student["room"] as? String ?: ""

            LaunchedEffect(student) {
                if (!aiCalled) {
                    aiCalled = true
                    isAiLoading = true
                    val prompt = """
                        Student $studentName is unwell. Risk $illnessProbability%. 
                        Give 3 simple instructions. Max 7 words each. No intro. Numbered list.
                    """.trimIndent()
                    
                    try {
                        val resp = generativeModel.generateContent(prompt)
                        aiSteps = (resp.text ?: "").lines()
                            .map { it.trim() }
                            .filter { it.isNotEmpty() && it.firstOrNull()?.isDigit() == true }
                            .map { it.replaceFirst(Regex("^\\d+[.\\)]\\s*"), "").trim() }
                    } catch (e: Exception) {
                        aiSteps = listOf(
                            "Monitor student in clinic.",
                            "Check forehead temperature.",
                            "Call parent if worsens."
                        )
                    } finally { isAiLoading = false }
                }
            }

            AnimatedVisibility(visible = true, enter = slideInVertically { it }, modifier = Modifier.align(Alignment.BottomCenter)) {
                Surface(modifier = Modifier.fillMaxWidth().fillMaxHeight(0.85f), color = bgLight, shape = RoundedCornerShape(topStart = 32.dp, topEnd = 32.dp), shadowElevation = 16.dp) {
                    Column(modifier = Modifier.padding(24.dp).verticalScroll(scrollState)) {
                        Box(modifier = Modifier.size(40.dp, 4.dp).background(Color.LightGray, CircleShape).align(Alignment.CenterHorizontally))
                        Spacer(Modifier.height(20.dp))
                        Text(studentName, fontSize = 28.sp, fontWeight = FontWeight.ExtraBold, color = textDark)
                        if (grade.isNotEmpty()) Text("Grade $grade • Room $room", fontSize = 14.sp, color = textGray)
                        
                        Spacer(Modifier.height(24.dp))
                        
                        // Assessment Card
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = Color.White),
                            shape = RoundedCornerShape(16.dp),
                            border = BorderStroke(1.dp, Color(0xFFE2E8F0))
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.HealthAndSafety, null, tint = brandBlue, modifier = Modifier.size(20.dp))
                                    Spacer(Modifier.width(8.dp))
                                    Text("CLINICAL ASSESSMENT", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = brandBlue, letterSpacing = 1.sp)
                                }
                                Spacer(Modifier.height(16.dp))
                                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.Bottom) {
                                    Column {
                                        Text("Risk Probability", fontSize = 13.sp, color = textGray)
                                        Text("$illnessProbability%", fontSize = 42.sp, fontWeight = FontWeight.Black, color = if (illnessProbability > 65) Color(0xFFEF4444) else Color(0xFF10B981))
                                    }
                                    Surface(color = (if (illnessProbability > 65) Color(0xFFEF4444) else Color(0xFF10B981)).copy(alpha = 0.1f), shape = RoundedCornerShape(12.dp)) {
                                        Text(if (illnessProbability > 65) "Attention" else "Stable", color = if (illnessProbability > 65) Color(0xFFEF4444) else Color(0xFF10B981), fontWeight = FontWeight.Bold, fontSize = 12.sp, modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp))
                                    }
                                }
                                
                                Spacer(Modifier.height(16.dp))
                                HorizontalDivider(color = bgLight)
                                Row(
                                    modifier = Modifier.fillMaxWidth().clickable { isDataExpanded = !isDataExpanded }.padding(vertical = 12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text("Detection Parameters", fontSize = 12.sp, color = textGray, fontWeight = FontWeight.Bold)
                                    Icon(if (isDataExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore, null, tint = textGray, modifier = Modifier.size(18.dp))
                                }
                                
                                AnimatedVisibility(visible = isDataExpanded, enter = expandVertically() + fadeIn(), exit = shrinkVertically() + fadeOut()) {
                                    Column(modifier = Modifier.padding(bottom = 8.dp)) {
                                        MetricRow("Smile Score (Avg)", "%.2f".format(finalSmileAvg))
                                        MetricRow("Alertness Index (Avg)", "%.2f".format(finalAlertnessAvg))
                                        MetricRow("Blink Frequency", "$blinkCount counts")
                                    }
                                }
                            }
                        }

                        Spacer(Modifier.height(28.dp))
                        Text("AI-RECOMMENDED STEPS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = textGray, letterSpacing = 1.sp)
                        Spacer(Modifier.height(12.dp))

                        if (isAiLoading) {
                            Box(modifier = Modifier.fillMaxWidth().height(100.dp), contentAlignment = Alignment.Center) { CircularProgressIndicator(color = brandBlue, strokeWidth = 3.dp) }
                        } else {
                            aiSteps.forEachIndexed { index, step ->
                                ClinicalStepBox(number = index + 1, content = step)
                                Spacer(Modifier.height(12.dp))
                            }
                        }

                        // --- Category Recommendation Section ---
                        val suggestedLevel = if (illnessProbability > 40) "moderate" else "mild"
                        val needsRedirect = suggestedLevel != fromLevel

                        Spacer(Modifier.height(24.dp))
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            color = brandBlue.copy(alpha = 0.05f),
                            shape = RoundedCornerShape(16.dp),
                            border = BorderStroke(1.dp, brandBlue.copy(alpha = 0.2f))
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.Psychology, null, tint = brandBlue, modifier = Modifier.size(20.dp))
                                    Spacer(Modifier.width(12.dp))
                                    Text("CATEGORY RECOMMENDATION", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = brandBlue)
                                }
                                Spacer(Modifier.height(12.dp))
                                Text(
                                    "Based on visual analysis and calculated risk, we suggest placing this student in the ${suggestedLevel.uppercase()} care category.",
                                    fontSize = 14.sp, color = textDark
                                )
                                if (needsRedirect) {
                                    Spacer(Modifier.height(16.dp))
                                    Button(
                                        onClick = { navController.navigate("assess/$suggestedLevel") { popUpTo("dashboard") } },
                                        modifier = Modifier.fillMaxWidth(),
                                        colors = ButtonDefaults.buttonColors(containerColor = brandBlue),
                                        shape = RoundedCornerShape(12.dp)
                                    ) {
                                        Icon(Icons.Default.SwapHoriz, null)
                                        Spacer(Modifier.width(8.dp))
                                        Text("Switch to ${suggestedLevel.replaceFirstChar { it.uppercase() }} Assessment")
                                    }
                                } else {
                                    Spacer(Modifier.height(8.dp))
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Default.Check, null, tint = Color(0xFF10B981), modifier = Modifier.size(16.dp))
                                        Spacer(Modifier.width(8.dp))
                                        Text("Matches current assessment level.", fontSize = 12.sp, color = Color(0xFF10B981))
                                    }
                                }
                            }
                        }

                        // --- Medical Reference Footer (Non-AI) ---
                        Spacer(Modifier.height(24.dp))
                        Surface(
                            modifier = Modifier.fillMaxWidth(),
                            color = Color(0xFFFEF2F2),
                            shape = RoundedCornerShape(16.dp),
                            border = BorderStroke(1.dp, Color(0xFFFEE2E2))
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.Info, null, tint = Color(0xFFB91C1C), modifier = Modifier.size(18.dp))
                                    Spacer(Modifier.width(8.dp))
                                    Text("Medical Reference (Non-AI)", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFFB91C1C))
                                }
                                Spacer(Modifier.height(12.dp))
                                Text(
                                    "Fever Guidelines:\n" +
                                    "• Low Grade Fever: 37.3°C - 38.0°C\n" +
                                    "• Moderate Fever: 38.1°C - 39.0°C\n" +
                                    "• High Fever: Above 39.1°C",
                                    fontSize = 13.sp, color = Color(0xFF7F1D1D), lineHeight = 20.sp
                                )
                                Spacer(Modifier.height(12.dp))
                                HorizontalDivider(color = Color(0xFFFEE2E2))
                                Spacer(Modifier.height(12.dp))
                                Text(
                                    "Clinical Warning:\n" +
                                    "If the student shows lethargy, drowsiness, rapid breathing, or unusual rashes, it may indicate a serious condition (e.g., pneumonia, meningitis). Contact guardians and seek medical attention immediately.",
                                    fontSize = 12.sp, color = Color(0xFF991B1B), lineHeight = 18.sp
                                )
                            }
                        }

                        Spacer(Modifier.height(32.dp))
                        Button(onClick = { navController.popBackStack() }, modifier = Modifier.fillMaxWidth().height(56.dp), shape = RoundedCornerShape(16.dp), colors = ButtonDefaults.buttonColors(containerColor = textDark)) {
                            Text("Dismiss Report", fontWeight = FontWeight.Bold)
                        }
                        Spacer(Modifier.height(24.dp))
                    }
                }
            }
        }
    }
}

@Composable
fun MetricRow(label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp), horizontalArrangement = Arrangement.SpaceBetween) {
        Text(label, fontSize = 13.sp, color = textGray)
        Text(value, fontSize = 13.sp, color = textDark, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun ClinicalStepBox(number: Int, content: String) {
    Surface(modifier = Modifier.fillMaxWidth(), color = Color.White, shape = RoundedCornerShape(16.dp), border = BorderStroke(1.dp, Color(0xFFE2E8F0))) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.Top) {
            Surface(modifier = Modifier.size(32.dp), shape = CircleShape, color = brandBlue.copy(alpha = 0.1f)) {
                Box(contentAlignment = Alignment.Center) { Text(text = number.toString(), color = brandBlue, fontWeight = FontWeight.Bold, fontSize = 14.sp) }
            }
            Spacer(Modifier.width(16.dp))
            Text(text = content, fontSize = 15.sp, color = textDark, lineHeight = 20.sp)
        }
    }
}

private fun ImageProxy.toBitmap(): Bitmap {
    val planeProxy = planes[0]
    val buffer = planeProxy.buffer
    val bytes = ByteArray(buffer.remaining())
    buffer.get(bytes)
    return android.graphics.BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
}

@Composable
fun ViewfinderCorner(rotation: Float) {
    Box(modifier = Modifier.size(24.dp).graphicsLayer { rotationZ = rotation }.drawBehind {
        val stroke = 3.dp.toPx()
        drawLine(color = Color.White.copy(alpha = 0.7f), start = Offset(0f, 0f), end = Offset(size.width, 0f), strokeWidth = stroke, cap = StrokeCap.Round)
        drawLine(color = Color.White.copy(alpha = 0.7f), start = Offset(0f, 0f), end = Offset(0f, size.height), strokeWidth = stroke, cap = StrokeCap.Round)
    })
}
