package com.example.trymlkit.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.trymlkit.ui.screens.*
import com.example.trymlkit.ui.theme.OnSurfaceVariant
import com.example.trymlkit.ui.theme.Primary
import com.example.trymlkit.ui.theme.Tertiary
import com.example.trymlkit.viewmodel.MainViewModel

@Composable
fun NavGraph() {
    val navController = rememberNavController()
    val viewModel: MainViewModel = viewModel()
    val showAlert by viewModel.showAlert.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {
        NavHost(navController = navController, startDestination = "login") {
            composable("login") {
                LoginScreen(navController)
            }
            composable("dashboard") {
                DashboardScreen(navController, viewModel)
            }
            composable("notifications") {
                NotificationsScreen(navController, viewModel)
            }
            composable("assess/{level}") { backStackEntry ->
                val level = backStackEntry.arguments?.getString("level") ?: "mild"
                AssessmentScreen(navController, level)
            }
            composable("emergency") {
                EmergencyProtocolScreen(navController, viewModel)
            }
            composable("emergency_active") {
                ActiveEmergencyScreen(navController, viewModel)
            }
            composable("student-profile/{fromLevel}") { backStackEntry ->
                val fromLevel = backStackEntry.arguments?.getString("fromLevel") ?: "mild"
                StudentProfileScreen(navController, fromLevel)
            }
        }

        if (showAlert) {
            CriticalAlertOverlay(
                onDismiss = { viewModel.hideAlert() },
                onActivate = {
                    viewModel.hideAlert()
                    navController.navigate("emergency")
                }
            )
        }
    }
}

@Composable
fun CriticalAlertOverlay(onDismiss: () -> Unit, onActivate: () -> Unit) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.6f))
            .clickable { onDismiss() },
        contentAlignment = Alignment.Center
    ) {
        Surface(
            modifier = Modifier
                .fillMaxWidth(0.85f)
                .padding(24.dp),
            shape = RoundedCornerShape(32.dp),
            color = Color.White
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Surface(
                    modifier = Modifier.size(80.dp),
                    shape = CircleShape,
                    color = Tertiary.copy(alpha = 0.1f)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            Icons.Default.Warning,
                            contentDescription = null,
                            modifier = Modifier.size(40.dp),
                            tint = Tertiary
                        )
                    }
                }

                Spacer(Modifier.height(24.dp))

                Text(
                    "CRITICAL ALERT",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    color = Primary
                )

                Spacer(Modifier.height(8.dp))

                Text(
                    "Immediate action required! A critical seizure condition has been reported. Activate emergency protocol?",
                    fontSize = 14.sp,
                    color = OnSurfaceVariant,
                    lineHeight = 20.sp,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center,
                    fontWeight = FontWeight.Bold
                )

                Spacer(Modifier.height(32.dp))

                Button(
                    onClick = onActivate,
                    modifier = Modifier.fillMaxWidth().height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Tertiary)
                ) {
                    Text("ACTIVATE PROTOCOL", fontWeight = FontWeight.Black)
                }

                TextButton(
                    onClick = onDismiss,
                    modifier = Modifier.fillMaxWidth().height(56.dp)
                ) {
                    Text("DISMISS", color = OnSurfaceVariant, fontWeight = FontWeight.Black, fontSize = 12.sp)
                }
            }
        }
    }
}