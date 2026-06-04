package com.example.medicalapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.medicalapp.ui.theme.*
import com.example.medicalapp.viewmodel.MainViewModel

@Composable
fun DashboardScreen(navController: NavController, viewModel: MainViewModel) {
    val isEmergencyActive by viewModel.isEmergencyActive.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Surface)
            .padding(24.dp)
    ) {
        // Top Bar
        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { navController.navigate("alerts") }) {
                Icon(Icons.Default.Notifications, contentDescription = "Alerts", tint = Primary)
            }
            IconButton(onClick = { navController.navigate("student-profile") }) {
                Icon(Icons.Default.Person, contentDescription = "Profile", tint = Primary)
            }
        }

        Text(
            text = "SMK Methodist",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = OnSurface
        )
        Text(
            text = "Monday, 26 April 2026",
            fontSize = 14.sp,
            color = OnSurfaceVariant,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        // Red Alert Button
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 32.dp),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(240.dp)
                    .clip(CircleShape)
                    .background(
                        Brush.linearGradient(
                            listOf(Tertiary, TertiaryContainer)
                        )
                    )
                    .clickable {
                        if (isEmergencyActive) {
                            navController.navigate("emergency_active")
                        } else {
                            navController.navigate("emergency")
                        }
                    },
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.Warning,
                        contentDescription = null,
                        modifier = Modifier.size(48.dp),
                        tint = Color.White
                    )
                    Text(
                        "RED ALERT",
                        fontWeight = FontWeight.Black,
                        fontSize = 20.sp,
                        color = Color.White
                    )
                    Text(
                        "Press and Hold",
                        fontSize = 10.sp,
                        color = Color.White.copy(alpha = 0.8f),
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        Text(
            "Quick Triage Selection",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = OnSurfaceVariant,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        TriageItem(
            title = "Mild — minor complaint",
            description = "Mild headache, stomach discomfort",
            color = SecondaryContainer,
            onClick = { navController.navigate("assess/mild") }
        )
        Spacer(Modifier.height(12.dp))
        TriageItem(
            title = "Moderate — needs attention",
            description = "Fever, injury, allergic reaction",
            color = Color(0xFFFEF9C3), // yellow-100
            onClick = { navController.navigate("assess/moderate") }
        )
        Spacer(Modifier.height(12.dp))
        TriageItem(
            title = "Critical — send to hospital",
            description = "Seizure, unconscious, severe injury",
            color = TertiaryContainer,
            onClick = {
                if (isEmergencyActive) {
                    navController.navigate("emergency_active")
                } else {
                    viewModel.triggerAlert()
                }
            },
            isEmergency = true,
            isActive = isEmergencyActive
        )
    }
}

@Composable
fun TriageItem(
    title: String,
    description: String,
    color: Color,
    onClick: () -> Unit,
    isEmergency: Boolean = false,
    isActive: Boolean = true
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(24.dp))
            .clickable(enabled = isActive) { onClick() },
        color = SurfaceContainerLow,
        shape = RoundedCornerShape(24.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(color, RoundedCornerShape(12.dp)),
                contentAlignment = Alignment.Center
            ) {
                // Icon would go here
            }
            Column(modifier = Modifier.padding(start = 16.dp).weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text(description, fontSize = 12.sp, color = OnSurfaceVariant)
            }
        }
    }
}
