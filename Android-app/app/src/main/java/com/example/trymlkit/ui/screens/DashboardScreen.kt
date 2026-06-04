package com.example.trymlkit.ui.screens

import android.content.Context
import android.widget.Toast
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.trymlkit.viewmodel.MainViewModel
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

private val bgLight = Color(0xFFF8FAFC)
private val brandBlue = Color(0xFF1D61E7)
private val textDark = Color(0xFF0F172A)
private val textGray = Color(0xFF64748B)
private val alertRed = Color(0xFFDC2626)
private val mildGreen = Color(0xFF99F6E4)
private val moderateYellow = Color(0xFFFEF08A)
private val criticalRed = Color(0xFFEF4444)

@Composable
fun DashboardScreen(navController: NavController, viewModel: MainViewModel) {
    val isEmergencyActive by viewModel.isEmergencyActive.collectAsState()
    val hasUnread by viewModel.hasUnreadNotifications.collectAsState(initial = false)
    val scrollState = rememberScrollState()
    val context = LocalContext.current
    var showMenu by remember { mutableStateOf(false) }
    
    val currentDate = remember {
        SimpleDateFormat("EEEE, d MMM yyyy", Locale.ENGLISH).format(Date())
    }

    Box(modifier = Modifier.fillMaxSize().background(bgLight)) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .verticalScroll(scrollState)
                .padding(bottom = 120.dp) 
        ) {
            // Header with Settings
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = CircleShape,
                            color = brandBlue.copy(alpha = 0.1f),
                            modifier = Modifier.size(32.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(Icons.Default.HealthAndSafety, null, tint = brandBlue, modifier = Modifier.size(18.dp))
                            }
                        }
                        Spacer(Modifier.width(8.dp))
                        Text("System Ready", color = brandBlue, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                    Spacer(Modifier.height(8.dp))
                    Text("SMK Methodist", fontSize = 24.sp, fontWeight = FontWeight.ExtraBold, color = textDark)
                    Text(currentDate, fontSize = 13.sp, color = textGray)
                }

                // Settings Button (Moved Add Profile here)
                Box {
                    IconButton(
                        onClick = { showMenu = true },
                        modifier = Modifier.background(Color.White, CircleShape).shadow(2.dp, CircleShape)
                    ) {
                        Icon(Icons.Default.Settings, contentDescription = "Settings", tint = textDark)
                    }
                    DropdownMenu(
                        expanded = showMenu,
                        onDismissRequest = { showMenu = false },
                        modifier = Modifier.background(Color.White).width(200.dp)
                    ) {
                        DropdownMenuItem(
                            text = { Text("Add Student Profile", fontWeight = FontWeight.Medium) },
                            leadingIcon = { Icon(Icons.Default.PersonAdd, null, tint = brandBlue) },
                            onClick = {
                                showMenu = false
                                navController.navigate("add-profile")
                            }
                        )
                        HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp), color = bgLight)
                        DropdownMenuItem(
                            text = { Text("Reset Login Status", color = Color.Red) },
                            leadingIcon = { Icon(Icons.Default.Logout, null, tint = Color.Red) },
                            onClick = {
                                showMenu = false
                                val sharedPrefs = context.getSharedPreferences("login_prefs", Context.MODE_PRIVATE)
                                sharedPrefs.edit().clear().apply()
                                navController.navigate("login") {
                                    popUpTo("dashboard") { inclusive = true }
                                }
                            }
                        )
                    }
                }
            }

            // Main Response Content
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Surface(
                    shape = RoundedCornerShape(100.dp),
                    color = Color(0xFFFEE2E2),
                    modifier = Modifier.padding(top = 8.dp)
                ) {
                    Text(
                        "IMMEDIATE RESPONSE",
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp),
                        color = Color(0xFF991B1B),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                }

                Box(
                    modifier = Modifier
                        .padding(vertical = 32.dp)
                        .size(280.dp)
                        .clickable { 
                            if (isEmergencyActive) {
                                navController.navigate("emergency_active")
                            } else {
                                navController.navigate("emergency")
                            }
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(260.dp)
                            .shadow(40.dp, CircleShape, spotColor = alertRed)
                            .background(alertRed, CircleShape)
                    )
                    
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(Icons.Default.LocationOn, null, tint = Color.White, modifier = Modifier.size(64.dp))
                        Spacer(Modifier.height(8.dp))
                        Text("RED ALERT", fontWeight = FontWeight.Black, fontSize = 30.sp, color = Color.White)
                        Text(
                            if (isEmergencyActive) "ACTIVE PROTOCOL" else "PRESS AND HOLD",
                            fontSize = 12.sp, color = Color.White.copy(alpha = 0.9f), fontWeight = FontWeight.Bold, letterSpacing = 1.sp
                        )
                    }
                }

                Text(
                    "Trigger this only for severe, life-threatening\nmedical emergencies.",
                    fontSize = 13.sp, color = textGray, textAlign = TextAlign.Center, lineHeight = 18.sp,
                    modifier = Modifier.padding(horizontal = 32.dp)
                )

                Spacer(Modifier.height(32.dp))

                Column(modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp)) {
                    Text("QUICK TRIAGE SELECTION", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = textGray, letterSpacing = 1.sp)
                    Spacer(Modifier.height(16.dp))

                    TriageCard(
                        title = "Mild — minor complaint",
                        subtitle = "Headache, stomach pain, mood swings",
                        icon = Icons.Default.SentimentSatisfied,
                        iconBg = mildGreen,
                        iconTint = Color(0xFF0F766E),
                        onClick = { navController.navigate("assess/mild") }
                    )
                    Spacer(Modifier.height(12.dp))
                    TriageCard(
                        title = "Moderate — needs attention",
                        subtitle = "Fevers, injuries, allergic reactions",
                        icon = Icons.Default.Warning,
                        iconBg = moderateYellow,
                        iconTint = Color(0xFF854D0E),
                        onClick = { navController.navigate("assess/moderate") }
                    )
                    Spacer(Modifier.height(12.dp))
                    TriageCard(
                        title = "Critical — immediate assist",
                        subtitle = "Seizures, unconsciousness, severe distress",
                        icon = Icons.Default.ReportProblem,
                        iconBg = if (isEmergencyActive) criticalRed else Color.LightGray,
                        iconTint = Color.White,
                        isCritical = isEmergencyActive,
                        onClick = { 
                            if (isEmergencyActive) {
                                navController.navigate("emergency_active")
                            } else {
                                Toast.makeText(context, "Activate emergency first", Toast.LENGTH_SHORT).show()
                            }
                        }
                    )
                }
            }
        }

        // Floating Bottom Navigation - Simplified (Dashboard & Alerts only)
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(start = 24.dp, end = 24.dp, bottom = 24.dp)
                .fillMaxWidth()
                .height(72.dp)
                .shadow(12.dp, RoundedCornerShape(36.dp))
                .background(Color.White, RoundedCornerShape(36.dp)),
            contentAlignment = Alignment.Center
        ) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceAround,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(
                    modifier = Modifier.clickable { /* current */ },
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(Icons.Default.GridView, null, tint = brandBlue, modifier = Modifier.size(24.dp))
                    Text("DASHBOARD", color = brandBlue, fontSize = 10.sp, fontWeight = FontWeight.ExtraBold)
                }

                Box(
                    modifier = Modifier.clickable { navController.navigate("notifications") },
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Box {
                            Icon(Icons.Default.Notifications, null, tint = textGray, modifier = Modifier.size(24.dp))
                            if (hasUnread) {
                                Surface(
                                    modifier = Modifier.size(8.dp).align(Alignment.TopEnd).offset(x = 1.dp, y = (-1).dp),
                                    color = Color.Red,
                                    shape = CircleShape,
                                    border = BorderStroke(1.5.dp, Color.White)
                                ) {}
                            }
                        }
                        Text("ALERTS", color = textGray, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun TriageCard(
    title: String,
    subtitle: String,
    icon: ImageVector,
    iconBg: Color,
    iconTint: Color,
    isCritical: Boolean = false,
    onClick: () -> Unit
) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
        modifier = Modifier.fillMaxWidth().shadow(2.dp, RoundedCornerShape(16.dp))
    ) {
        Row(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(modifier = Modifier.size(48.dp).background(iconBg, RoundedCornerShape(12.dp)), contentAlignment = Alignment.Center) {
                Icon(icon, null, tint = iconTint, modifier = Modifier.size(24.dp))
            }
            Column(modifier = Modifier.padding(horizontal = 16.dp).weight(1f)) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = textDark)
                Text(subtitle, fontSize = 12.sp, color = textGray, lineHeight = 16.sp)
            }
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, null, tint = Color.LightGray, modifier = Modifier.size(20.dp))
        }
    }
}
