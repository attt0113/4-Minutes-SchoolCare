package com.example.medicalapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.medicalapp.ui.theme.Primary
import com.example.medicalapp.ui.theme.Tertiary
import com.example.medicalapp.viewmodel.MainViewModel
import kotlinx.coroutines.delay

@Composable
fun ActiveEmergencyScreen(navController: NavController, viewModel: MainViewModel) {
    val startTime by viewModel.emergencyStartTime.collectAsState()
    val INITIAL_TIME = 239 // 03:59
    val AMBULANCE_TIME = 600 // 10:00
    
    var elapsed by remember { mutableStateOf(INITIAL_TIME) }
    var ambulanceElapsed by remember { mutableStateOf(AMBULANCE_TIME) }
    var showData by remember { mutableStateOf(false) }

    LaunchedEffect(startTime) {
        while (startTime != null) {
            val secondsPassed = ((System.currentTimeMillis() - startTime!!) / 1000).toInt()
            elapsed = (INITIAL_TIME - secondsPassed).coerceAtLeast(0)
            ambulanceElapsed = (AMBULANCE_TIME - secondsPassed).coerceAtLeast(0)
            delay(1000)
        }
    }

    fun formatTime(seconds: Int): String {
        val m = seconds / 60
        val s = seconds % 60
        return String.format("%02d:%02d", m, s)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Tertiary)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                "4 minutes",
                fontWeight = FontWeight.Black,
                color = Color.White,
                fontSize = 18.sp
            )
            TextButton(onClick = { navController.navigate("dashboard") }) {
                Text("CLOSE", color = Color.White, fontWeight = FontWeight.Bold)
            }
        }

        Spacer(Modifier.height(48.dp))

        // Timer Section
        Text(
            "Protocol In Progress",
            color = Color.White.copy(alpha = 0.8f),
            fontWeight = FontWeight.Bold,
            fontSize = 12.sp,
            letterSpacing = 2.sp
        )
        Text(
            formatTime(elapsed),
            fontSize = 80.sp,
            fontWeight = FontWeight.Black,
            color = Color.White,
            letterSpacing = (-4).sp
        )

        Spacer(Modifier.height(32.dp))

        // Data Section
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White.copy(alpha = 0.05f), RoundedCornerShape(24.dp))
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { showData = !showData },
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "MONITORING DATA",
                    color = Color.White,
                    fontWeight = FontWeight.Black,
                    fontSize = 12.sp
                )
                Icon(
                    if (showData) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                    contentDescription = null,
                    tint = Color.White
                )
            }

            if (showData) {
                Spacer(Modifier.height(16.dp))
                DataRow("Heart Rate", "112 BPM")
                DataRow("SpO2", "98%")
                DataRow("Movement", "Significant")
            }
        }

        Spacer(Modifier.height(16.dp))

        // Ambulance Arrival
        Surface(
            modifier = Modifier.fillMaxWidth(),
            color = Color.White.copy(alpha = 0.1f),
            shape = RoundedCornerShape(24.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    "ESTIMATED AMBULANCE ARRIVAL",
                    color = Color.White.copy(alpha = 0.8f),
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Black
                )
                Text(
                    formatTime(ambulanceElapsed),
                    fontSize = 40.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
            }
        }

        Spacer(Modifier.weight(1f))

        // End Button
        Button(
            onClick = {
                viewModel.setEmergencyActive(false)
                navController.navigate("dashboard")
            },
            modifier = Modifier.fillMaxWidth().height(64.dp),
            shape = RoundedCornerShape(24.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Color.White)
        ) {
            Icon(Icons.Default.Warning, contentDescription = null, tint = Tertiary)
            Spacer(Modifier.width(8.dp))
            Text("END EMERGENCY PROTOCOL", color = Tertiary, fontWeight = FontWeight.Black)
        }
    }
}

@Composable
fun DataRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(label, color = Color.White.copy(alpha = 0.6f), fontSize = 12.sp, fontWeight = FontWeight.Bold)
        Text(value, color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Black)
    }
}
