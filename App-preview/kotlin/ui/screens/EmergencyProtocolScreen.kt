package com.example.medicalapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
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

@Composable
fun EmergencyProtocolScreen(navController: NavController, viewModel: MainViewModel) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(modifier = Modifier.fillMaxWidth()) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
        }

        Spacer(Modifier.height(32.dp))

        Text(
            "Final Confirmation",
            fontSize = 12.sp,
            fontWeight = FontWeight.Black,
            color = Tertiary,
            letterSpacing = 2.sp
        )
        Text(
            "Activate Protocol?",
            fontSize = 32.sp,
            fontWeight = FontWeight.Black,
            color = Primary,
            modifier = Modifier.padding(bottom = 16.dp)
        )
        Text(
            "This will instantly notify the medical team, campus security, and emergency services for SMK Methodist.",
            textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            fontSize = 14.sp,
            color = Color.Gray,
            lineHeight = 22.sp,
            modifier = Modifier.padding(horizontal = 24.dp)
        )

        Spacer(Modifier.weight(1f))

        Button(
            onClick = {
                viewModel.setEmergencyActive(true)
                navController.navigate("emergency_active") {
                    popUpTo("dashboard")
                }
            },
            modifier = Modifier.fillMaxWidth().height(64.dp),
            shape = RoundedCornerShape(24.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Tertiary)
        ) {
            Text("ACTIVATE NOW", fontWeight = FontWeight.Black, fontSize = 16.sp)
        }

        TextButton(
            onClick = { navController.popBackStack() },
            modifier = Modifier.padding(top = 16.dp)
        ) {
            Text("Cancel and Return", color = Color.Gray, fontWeight = FontWeight.Bold)
        }
    }
}
