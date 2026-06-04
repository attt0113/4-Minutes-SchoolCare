package com.example.trymlkit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.trymlkit.viewmodel.MainViewModel
import com.example.trymlkit.viewmodel.Notification
import com.example.trymlkit.viewmodel.NotificationType

private val bgLight = Color(0xFFF8FAFC)
private val brandBlue = Color(0xFF1D61E7)
private val textDark = Color(0xFF0F172A)
private val textGray = Color(0xFF64748B)

@Composable
fun NotificationsScreen(navController: NavController, viewModel: MainViewModel) {
    var searchQuery by remember { mutableStateOf("") }
    val notifications by viewModel.notifications.collectAsState()
    
    val filteredNotifications = remember(notifications, searchQuery) {
        if (searchQuery.isEmpty()) notifications
        else notifications.filter { 
            it.title.contains(searchQuery, ignoreCase = true) || 
            it.description.contains(searchQuery, ignoreCase = true) 
        }
    }

    // Mark all as read when entering the screen
    LaunchedEffect(Unit) {
        viewModel.markAllAsRead()
    }

    Box(modifier = Modifier.fillMaxSize().background(bgLight)) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .padding(horizontal = 24.dp)
        ) {
            Spacer(Modifier.height(32.dp))
            
            Text(
                "Notifications",
                fontSize = 32.sp,
                fontWeight = FontWeight.Black,
                color = textDark
            )
            
            Text(
                "Real-time emergency and clinical alerts.",
                fontSize = 16.sp,
                color = textGray,
                modifier = Modifier.padding(top = 8.dp)
            )
            
            Spacer(Modifier.height(24.dp))
            
            // Search Bar
            Surface(
                modifier = Modifier.fillMaxWidth().height(56.dp),
                color = Color(0xFFE2E8F0).copy(alpha = 0.5f),
                shape = RoundedCornerShape(28.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxSize().padding(horizontal = 20.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Search, null, tint = textGray)
                    Spacer(Modifier.width(12.dp))
                    BasicTextField(
                        value = searchQuery,
                        onValueChange = { searchQuery = it },
                        modifier = Modifier.weight(1f),
                        textStyle = LocalTextStyle.current.copy(fontSize = 16.sp),
                        decorationBox = { innerTextField ->
                            if (searchQuery.isEmpty()) {
                                Text("Search notifications...", color = textGray)
                            }
                            innerTextField()
                        }
                    )
                }
            }
            
            Spacer(Modifier.height(24.dp))

            if (filteredNotifications.isEmpty()) {
                // Empty State
                Column(
                    modifier = Modifier.weight(1f).fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(
                        Icons.Default.NotificationsOff,
                        contentDescription = null,
                        modifier = Modifier.size(100.dp),
                        tint = Color.LightGray
                    )
                    Spacer(Modifier.height(16.dp))
                    Text(
                        if (searchQuery.isEmpty()) "NO NOTIFICATIONS YET" else "NO RESULTS FOUND",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.LightGray,
                        letterSpacing = 1.sp
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    contentPadding = PaddingValues(bottom = 120.dp)
                ) {
                    items(filteredNotifications) { notification ->
                        NotificationListItem(notification)
                    }
                }
            }
        }

        // Floating Bottom Navigation
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(start = 16.dp, end = 16.dp, bottom = 24.dp)
                .fillMaxWidth()
                .height(80.dp)
                .shadow(12.dp, RoundedCornerShape(40.dp))
                .background(Color.White, RoundedCornerShape(40.dp)),
            contentAlignment = Alignment.Center
        ) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 8.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(
                    modifier = Modifier.weight(1f).clickable { 
                        navController.navigate("dashboard") {
                            popUpTo("dashboard") { inclusive = true }
                        }
                    },
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Icon(Icons.Default.GridView, null, tint = textGray, modifier = Modifier.size(24.dp))
                    Text("DASHBOARD", color = textGray, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                }

                Surface(
                    shape = RoundedCornerShape(30.dp),
                    color = brandBlue,
                    modifier = Modifier.height(56.dp).weight(1f)
                ) {
                    Column(
                        modifier = Modifier.fillMaxSize(),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(Icons.Default.Notifications, null, tint = Color.White, modifier = Modifier.size(22.dp))
                        Text("NOTIFICATIONS", color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
fun NotificationListItem(notification: Notification) {
    Surface(
        color = Color.White,
        shape = RoundedCornerShape(20.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.Top
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(
                        when (notification.type) {
                            NotificationType.EMERGENCY -> Color(0xFFFEE2E2)
                            NotificationType.CLINICAL -> Color(0xFFE0F2FE)
                            else -> Color(0xFFF1F5F9)
                        },
                        CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = when (notification.type) {
                        NotificationType.EMERGENCY -> Icons.Default.Report
                        NotificationType.CLINICAL -> Icons.Default.MedicalInformation
                        else -> Icons.Default.Info
                    },
                    contentDescription = null,
                    tint = when (notification.type) {
                        NotificationType.EMERGENCY -> Color(0xFFDC2626)
                        NotificationType.CLINICAL -> Color(0xFF0284C7)
                        else -> textGray
                    },
                    modifier = Modifier.size(24.dp)
                )
            }
            
            Column(modifier = Modifier.padding(start = 16.dp).weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        notification.title,
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = textDark
                    )
                    Text(
                        notification.time,
                        fontSize = 11.sp,
                        color = textGray
                    )
                }
                Spacer(Modifier.height(4.dp))
                Text(
                    notification.description,
                    fontSize = 13.sp,
                    color = textGray,
                    lineHeight = 18.sp
                )
            }
        }
    }
}
