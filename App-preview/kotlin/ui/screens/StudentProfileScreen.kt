package com.example.medicalapp.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Face
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.medicalapp.ui.theme.*
import kotlinx.coroutines.delay

data class StudentProfile(
    val id: String,
    val name: String,
    val grade: String,
    val room: String,
    val illnessProbability: Int,
    val allergy: String,
    val chronic: String,
    val clinicalInsight: String,
    val avatarInitials: String,
    val steps: List<Pair<String, String>>
)

val students = listOf(
    StudentProfile(
        id = "discomfort_male",
        name = "Kevin Zhang",
        grade = "Grade 10",
        room = "Room 302",
        illnessProbability = 92,
        allergy = "PEANUTS, IBUPROFEN",
        chronic = "MIGRAINE RISK",
        clinicalInsight = "Facial thermal congestion, high cranial muscular stress indicators, and pupil light sensitivity patterns suggest an active acute migraine attack with high physiological discomfort.",
        avatarInitials = "KZ",
        steps = listOf(
            "Seat in cold rest room" to "Transfer student to a cool, darkened room immediately. Limit bright screens or fluorescent lighting.",
            "No Ibuprofen" to "Do not administer Ibuprofen due to documented severe allergy. Provide cold compress and plenty of room-temperature water.",
            "Urgent medical tracking" to "If physical distress increases or visual aura occurs, alert parents or school nurse immediately."
        )
    ),
    StudentProfile(
        id = "happy_female1",
        name = "Chloe Tan",
        grade = "Grade 9",
        room = "Room 104",
        illnessProbability = 4,
        allergy = "NONE",
        chronic = "NONE",
        clinicalInsight = "Symmetrical facial blood flow, normal pupil constriction, and vibrant smile mechanics indicate ideal physiological tone. Body temperature measured at 36.5°C.",
        avatarInitials = "CT",
        steps = listOf(
            "Normal activity" to "Cleared for gym class, recess, and physical exercise. No current rest required.",
            "Ensure hydration" to "Advise standard hydration of 1.5L throughout the school day.",
            "File update" to "Logged as fully fit and healthy for standard school curriculum."
        )
    ),
    StudentProfile(
        id = "happy_female2",
        name = "Sarah Lim",
        grade = "Grade 10",
        room = "Room 201",
        illnessProbability = 5,
        allergy = "NONE",
        chronic = "ASTHMA (Mild / Controlled)",
        clinicalInsight = "Respiratory biometric markers and nostril airflow analysis display stable flow with no indication of wheezing or respiratory effort. Pupil reflection is within the healthy baseline.",
        avatarInitials = "SL",
        steps = listOf(
            "Inhaler confirmation" to "Briefly verify that the student has their blue reliever inhaler inside their backpack, as a preventative measure.",
            "Return to class" to "Student is enthusiastic, showing peaceful biometrics. Return to normal learning sessions immediately.",
            "Observation protocol" to "No active observation required. Logged as stable and safe."
        )
    ),
    StudentProfile(
        id = "happy_male",
        name = "Ryan Lee",
        grade = "Grade 11",
        room = "Room 403",
        illnessProbability = 3,
        allergy = "NONE",
        chronic = "NONE",
        clinicalInsight = "Smooth ocular and micro-expression parameters. Ideal heat dissipation around frontal and nasal lobes. Full physiological readiness detected.",
        avatarInitials = "RL",
        steps = listOf(
            "Clearance of task" to "Student reports perfect wellness and is approved for exams or long learning activities.",
            "No monitoring" to "General state of health is superb with perfect heart rate parameters (estimated 72 BPM).",
            "Routine wellness log" to "Close student check-out file with normal/healthy designation."
        )
    )
)

@OptIn(ExperimentalAnimationApi::class)
@Composable
fun StudentProfileScreen(navController: NavController) {
    var selectedId by remember { mutableStateOf("discomfort_male") }
    var isScanning by remember { mutableStateOf(false) }
    var scanText by remember { mutableStateOf("AI Analyzing Biometrics") }
    val currentStudent = remember(selectedId) { students.first { it.id == selectedId } }

    LaunchedEffect(selectedId) {
        isScanning = true
        scanText = "Initializing Thermal Map..."
        delay(350)
        scanText = "Mapping Facial Biometrics..."
        delay(350)
        scanText = "Analyzing Pupil Dilation..."
        delay(350)
        scanText = "Calculating Illness Probability..."
        delay(350)
        isScanning = false
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Surface)
            .verticalScroll(rememberScrollState())
            .padding(24.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Primary)
            }
            Text(
                text = "AI Medical Scan",
                fontSize = 18.sp,
                fontWeight = FontWeight.Black,
                color = Primary
            )
            Box(Modifier.size(48.dp)) // Spacer
        }

        Spacer(Modifier.height(16.dp))

        // Student Multi-Select Buttons
        Text(
            text = "Select Student (Mock Scan)",
            fontWeight = FontWeight.Black,
            fontSize = 12.sp,
            color = OnSurfaceVariant,
            letterSpacing = 1.sp
        )
        Spacer(Modifier.height(8.dp))
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            students.forEach { student ->
                val isSelected = student.id == selectedId
                val btnColor = if (isSelected) Primary else Color.White
                val textColor = if (isSelected) Color.White else Primary

                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(12.dp))
                        .background(btnColor)
                        .clickable { selectedId = student.id }
                        .padding(vertical = 12.dp, horizontal = 4.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .clip(CircleShape)
                                .background(if (isSelected) Color.White.copy(alpha = 0.2f) else Primary.copy(alpha = 0.1f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                student.avatarInitials,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color.White else Primary
                            )
                        }
                        Spacer(Modifier.height(4.dp))
                        Text(
                            student.name.split(" ")[0],
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            color = textColor
                        )
                    }
                }
            }
        }

        Spacer(Modifier.height(24.dp))

        // Animated Viewport Scan
        Surface(
            color = if (isScanning) Primary.copy(alpha = 0.05f) else Color.White,
            shape = RoundedCornerShape(24.dp),
            shadowElevation = 1.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(
                    modifier = Modifier
                        .size(120.dp)
                        .clip(CircleShape)
                        .background(if (isScanning) Primary.copy(alpha = 0.2f) else Primary.copy(alpha = 0.1f)),
                    contentAlignment = Alignment.Center
                ) {
                    if (isScanning) {
                        CircularProgressIndicator(
                            color = Primary,
                            strokeWidth = 3.dp,
                            modifier = Modifier.size(100.dp)
                        )
                    }
                    Icon(
                        Icons.Default.Face,
                        contentDescription = "Facial Scan",
                        tint = Primary,
                        modifier = Modifier.size(64.dp)
                    )
                }

                Spacer(Modifier.height(16.dp))

                Text(
                    text = if (isScanning) scanText else "Biometrics Scan Complete",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (isScanning) Primary else Color(0xFF10B981)
                )
            }
        }

        Spacer(Modifier.height(24.dp))

        AnimatedVisibility(
            visible = !isScanning,
            enter = fadeIn() + slideInVertically(),
            exit = fadeOut()
        ) {
            Column {
                // Profile Card
                Surface(
                    color = Color.White,
                    shape = RoundedCornerShape(24.dp),
                    shadowElevation = 1.dp,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(24.dp)) {
                        Text(
                            currentStudent.name,
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black,
                            color = Primary
                        )
                        Text(
                            "${currentStudent.grade} • ${currentStudent.room}",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = OnSurfaceVariant
                        )

                        Spacer(Modifier.height(16.dp))

                        // Badges
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            if (currentStudent.allergy != "NONE") {
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(Color(0xFFFEF2F2))
                                        .padding(horizontal = 12.dp, vertical = 6.dp)
                                ) {
                                    Text(
                                        "Allergy: ${currentStudent.allergy}",
                                        color = Color(0xFF991B1B),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Black
                                    )
                                }
                            }
                            if (currentStudent.chronic != "NONE") {
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(Color(0xFFFFFBEB))
                                        .padding(horizontal = 12.dp, vertical = 6.dp)
                                ) {
                                    Text(
                                        "Chronic: ${currentStudent.chronic}",
                                        color = Color(0xFF92400E),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Black
                                    )
                                }
                            }
                        }

                        Spacer(Modifier.height(20.dp))

                        // AI Clinical Insight
                        Surface(
                            color = Primary.copy(alpha = 0.03f),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        Icons.Default.Info,
                                        contentDescription = "Insight",
                                        tint = Primary,
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(Modifier.width(8.dp))
                                    Text(
                                        "AI Clinical Insight",
                                        fontWeight = FontWeight.Black,
                                        fontSize = 12.sp,
                                        color = Primary,
                                        letterSpacing = 1.sp
                                    )
                                }
                                Spacer(Modifier.height(8.dp))
                                Text(
                                    text = "Probability of Illness: ${currentStudent.illnessProbability}%",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Black,
                                    color = if (currentStudent.illnessProbability > 50) Color(0xFFDC2626) else Color(0xFF10B981)
                                )
                                Spacer(Modifier.height(4.dp))
                                Text(
                                    currentStudent.clinicalInsight,
                                    fontSize = 13.sp,
                                    color = OnSurfaceVariant,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }

                        Spacer(Modifier.height(24.dp))

                        // Guidance Steps
                        Text(
                            "Assessment Guidance",
                            fontWeight = FontWeight.Black,
                            fontSize = 12.sp,
                            color = OnSurfaceVariant,
                            letterSpacing = 1.sp
                        )
                        Spacer(Modifier.height(12.dp))
                        currentStudent.steps.forEachIndexed { idx, step ->
                            Column(modifier = Modifier.padding(vertical = 8.dp)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .size(20.dp)
                                            .clip(CircleShape)
                                            .background(Primary),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text(
                                            "${idx + 1}",
                                            color = Color.White,
                                            fontSize = 10.sp,
                                            fontWeight = FontWeight.Black
                                        )
                                    }
                                    Spacer(Modifier.width(8.dp))
                                    Text(step.first, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Primary)
                                }
                                Spacer(Modifier.height(4.dp))
                                Text(
                                    step.second,
                                    fontSize = 12.sp,
                                    color = OnSurfaceVariant,
                                    modifier = Modifier.padding(start = 28.dp)
                                )
                            }
                        }
                    }
                }

                Spacer(Modifier.height(24.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(
                        onClick = { navController.popBackStack() },
                        colors = ButtonDefaults.buttonColors(containerColor = Secondary),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.weight(1f).height(50.dp)
                    ) {
                        Text("Rest in Class", fontWeight = FontWeight.Black, fontSize = 12.sp, color = Color.White)
                    }
                    Button(
                        onClick = { navController.popBackStack() },
                        colors = ButtonDefaults.buttonColors(containerColor = Primary),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.weight(1f).height(50.dp)
                    ) {
                        Text("Send to Office", fontWeight = FontWeight.Black, fontSize = 12.sp)
                    }
                }
            }
        }
    }
}
