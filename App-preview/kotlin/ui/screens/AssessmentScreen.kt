package com.example.medicalapp.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.medicalapp.ui.theme.*

@Composable
fun AssessmentScreen(navController: NavController, level: String) {
    val isMild = level == "mild"
    val themeColor = if (isMild) SecondaryContainer else Color(0xFFFEF9C3)
    val onThemeColor = if (isMild) OnSecondaryContainer else Color(0xFF854D0E)

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Surface)
            .padding(24.dp)
    ) {
        IconButton(onClick = { navController.popBackStack() }) {
            Icon(Icons.Default.ArrowBack, contentDescription = "Back")
        }

        Spacer(Modifier.height(16.dp))

        Surface(
            color = themeColor,
            shape = RoundedCornerShape(full = 50),
            modifier = Modifier.padding(bottom = 16.dp)
        ) {
            Text(
                text = if (isMild) "MILD ASSESSMENT" else "MODERATE ASSESSMENT",
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
                fontSize = 10.sp,
                fontWeight = FontWeight.Black,
                color = onThemeColor
            )
        }

        Text(
            text = if (isMild) "Step-by-step evaluation for minor symptoms." else "Prompt evaluation for urgent symptoms.",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = OnSurface,
            lineHeight = 24.sp,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        // Mock assessment steps
        AssessmentStep(1, "Verify student identity and symptoms.")
        AssessmentStep(2, "Check temperature and vital signs.")
        AssessmentStep(3, "Document findings in clinical log.")

        Spacer(Modifier.weight(1f))

        Button(
            onClick = { navController.popBackStack() },
            modifier = Modifier.fillMaxWidth().height(56.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Primary)
        ) {
            Text("Complete Assessment", fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun AssessmentStep(number: Int, text: String) {
    Row(
        modifier = Modifier.padding(vertical = 12.dp),
        verticalAlignment = Alignment.Top
    ) {
        Surface(
            modifier = Modifier.size(24.dp),
            color = Primary.copy(alpha = 0.1f),
            shape = RoundedCornerShape(6.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Text(number.toString(), fontWeight = FontWeight.Black, fontSize = 12.sp, color = Primary)
            }
        }
        Text(
            text = text,
            modifier = Modifier.padding(start = 16.dp),
            fontSize = 14.sp,
            color = OnSurfaceVariant,
            lineHeight = 20.sp
        )
    }
}
