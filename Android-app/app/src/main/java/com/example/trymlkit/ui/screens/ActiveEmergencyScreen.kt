package com.example.trymlkit.ui.screens

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.trymlkit.viewmodel.MainViewModel
import kotlinx.coroutines.delay

private val brandBlue = Color(0xFF1D61E7)
private val alertRed = Color(0xFFC00000)
private val bgLight = Color(0xFFF8FAFC)

@Composable
fun ActiveEmergencyScreen(navController: NavController, viewModel: MainViewModel) {
    val startTime by viewModel.emergencyStartTime.collectAsState()
    val arrivalTimeMillis by viewModel.estimatedArrivalMillis.collectAsState()
    
    var countdownTimeStr by remember { mutableStateOf("04:00") }
    var remainingTimeStr by remember { mutableStateOf("00:00") }
    var isDataVisible by remember { mutableStateOf(true) }

    LaunchedEffect(startTime, arrivalTimeMillis) {
        while (true) {
            val now = System.currentTimeMillis()
            
            // 4-minute Countdown (Elapsed Time section now counts down from 4:00)
            startTime?.let {
                val totalDuration = 4 * 60 * 1000L
                val diff = (it + totalDuration - now) / 1000
                if (diff > 0) {
                    val mins = diff / 60
                    val secs = diff % 60
                    countdownTimeStr = "%02d:%02d".format(mins, secs)
                } else {
                    countdownTimeStr = "00:00"
                }
            }

            // Remaining Time (Arrival - Count down)
            arrivalTimeMillis?.let {
                val diff = (it - now) / 1000
                if (diff > 0) {
                    val mins = diff / 60
                    val secs = diff % 60
                    remainingTimeStr = "%02d:%02d".format(mins, secs)
                } else {
                    remainingTimeStr = "00:00"
                }
            }
            delay(1000)
        }
    }

    Scaffold(
        topBar = {
            Surface(
                modifier = Modifier.fillMaxWidth().statusBarsPadding(),
                color = Color.White,
                shadowElevation = 2.dp
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Icon(Icons.Default.Emergency, contentDescription = null, tint = brandBlue, modifier = Modifier.size(24.dp))
                    
                    Text(
                        "ACTIVE EMERGENCY",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp,
                        color = Color.Gray
                    )
                    
                    TextButton(onClick = { 
                        navController.navigate("dashboard") {
                            popUpTo("dashboard") { inclusive = true }
                        }
                    }) {
                        Text("CLOSE", color = brandBlue, fontWeight = FontWeight.ExtraBold, fontSize = 14.sp)
                    }
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(bgLight)
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // 1. Countdown Card (Main Red Card)
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                color = alertRed
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("ELAPSED TIME", color = Color.White.copy(alpha = 0.8f), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    Text(countdownTimeStr, color = Color.White, fontSize = 64.sp, fontWeight = FontWeight.Black)
                    
                    Surface(
                        color = Color.White.copy(alpha = 0.2f),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Row(modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Warning, null, tint = Color.White, modifier = Modifier.size(14.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("CRITICAL PROTOCOL: SEIZURE", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                    
                    Spacer(Modifier.height(24.dp))
                    
                    EmergencyInstruction(Icons.Default.Block, "DO NOT put anything in the mouth.")
                    EmergencyInstruction(Icons.Default.AccessibilityNew, "Turn student on their side (recovery position).")
                    EmergencyInstruction(Icons.Default.Shield, "Protect the head from impact.")
                    EmergencyInstruction(Icons.Default.Waves, "Clear the surrounding area.")
                }
            }

            Spacer(Modifier.height(16.dp))

            // 2. Ambulance Called Card
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(24.dp),
                color = Color(0xFF991B1B) 
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text("Ambulance Called", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                    Text(
                        "Dispatch confirmed at 14:22.\nEmergency responders are en route to North Wing Entrance.",
                        color = Color.White.copy(alpha = 0.9f),
                        fontSize = 13.sp,
                        lineHeight = 18.sp
                    )
                    
                    Spacer(Modifier.height(20.dp))
                    
                    Surface(
                        modifier = Modifier.fillMaxWidth(),
                        color = Color.White.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Column(
                            modifier = Modifier.padding(16.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Text("ESTIMATED ARRIVAL", color = Color.White.copy(alpha = 0.8f), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                            Text(remainingTimeStr, color = Color.White, fontSize = 48.sp, fontWeight = FontWeight.Black)
                        }
                    }
                }
            }

            Spacer(Modifier.height(16.dp))

            // 3. Medical History QR Card
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = Color(0xFFE2E8F0)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("SCAN FOR MEDICAL HISTORY", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Color.Gray)
                    Text("AUTHORIZED PARAMEDICS AND\nHOSPITAL STAFF ONLY.", textAlign = TextAlign.Center, fontSize = 11.sp, color = Color.Gray)
                    
                    Spacer(Modifier.height(24.dp))
                    
                    Box(
                        modifier = Modifier
                            .size(200.dp)
                            .background(Color.White, RoundedCornerShape(12.dp))
                            .border(4.dp, brandBlue, RoundedCornerShape(12.dp))
                            .padding(16.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.QrCode2, null, modifier = Modifier.fillMaxSize(), tint = Color.Black)
                    }
                    
                    Surface(
                        modifier = Modifier.offset(y = (-12).dp),
                        color = brandBlue,
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text("EFFECTIVE SCANNING AREA", color = Color.White, fontSize = 8.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                    }
                }
            }

            Spacer(Modifier.height(16.dp))

            // 4. Data Shared via QR Card
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = Color(0xFFEFF6FF)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Visibility, contentDescription = null, tint = brandBlue, modifier = Modifier.size(18.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Data Shared via QR", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = brandBlue)
                        }
                        IconButton(onClick = { isDataVisible = !isDataVisible }) {
                            Icon(
                                if (isDataVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = null,
                                tint = brandBlue
                            )
                        }
                    }
                    
                    if (isDataVisible) {
                        Spacer(Modifier.height(12.dp))
                        EmergencyDataRow("BLOOD TYPE", "O+")
                        EmergencyDataRow("ALLERGIES", "Penicillin, Peanuts", isAlert = true)
                        EmergencyDataRow("MEDICAL HISTORY", "Congenital Heart Condition")
                    }

                    Spacer(Modifier.height(16.dp))
                    Surface(color = brandBlue.copy(alpha = 0.05f), shape = RoundedCornerShape(8.dp)) {
                        Row(modifier = Modifier.padding(12.dp)) {
                            Icon(Icons.Default.Lock, null, tint = brandBlue, modifier = Modifier.size(14.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("Note: Identity, address, and academic records are HIDDEN for student privacy.", fontSize = 11.sp, color = brandBlue, lineHeight = 15.sp)
                        }
                    }
                }
            }
            
            Text(
                "GENERATED ON: OCTOBER 28, 2023 | LOGGED FOR SECURITY AND TRANSPARENCY",
                fontSize = 8.sp, color = Color.LightGray, modifier = Modifier.padding(vertical = 12.dp)
            )
            
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Info, null, tint = Color.Gray, modifier = Modifier.size(14.dp))
                Spacer(Modifier.width(4.dp))
                Text("QR code will be expired after 30 minutes", fontSize = 11.sp, color = Color.Gray)
            }
            
            Spacer(Modifier.height(32.dp))

            // 5. End Emergency Protocol Button
            Button(
                onClick = { 
                    viewModel.endEmergency()
                    navController.navigate("dashboard") {
                        popUpTo("dashboard") { inclusive = true }
                    }
                },
                modifier = Modifier.fillMaxWidth().height(56.dp),
                colors = ButtonDefaults.buttonColors(containerColor = alertRed),
                shape = RoundedCornerShape(16.dp)
            ) {
                Text("END EMERGENCY PROTOCOL", color = Color.White, fontWeight = FontWeight.Black, fontSize = 16.sp)
            }
            
            Spacer(Modifier.height(40.dp))
        }
    }
}

@Composable
fun EmergencyInstruction(icon: ImageVector, text: String) {
    Surface(
        color = Color.White.copy(alpha = 0.1f),
        shape = RoundedCornerShape(12.dp),
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
    ) {
        Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(icon, null, tint = Color.White, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(16.dp))
            Text(text, color = Color.White, fontSize = 13.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
fun EmergencyDataRow(label: String, value: String, isAlert: Boolean = false) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
        Text(value, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = if (isAlert) Color.Red else Color.Black)
    }
}
