package com.example.trymlkit.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
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
import androidx.navigation.NavController
import com.example.trymlkit.ui.theme.*
import com.example.trymlkit.viewmodel.MainViewModel
import com.example.trymlkit.viewmodel.NotificationType
import com.example.trymlkit.viewmodel.Notification

@Composable
fun AlertsScreen(navController: NavController, viewModel: MainViewModel) {
    val notifications by viewModel.notifications.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Surface)
            .padding(24.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            TextButton(onClick = { viewModel.markAllAsRead() }) {
                Text("Mark Read", color = Primary, fontWeight = FontWeight.Bold)
            }
        }

        Text(
            "Protocol History",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = OnSurface,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        LazyColumn(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            items(notifications) { notification ->
                AlertItem(notification)
            }
        }
    }
}

@Composable
fun AlertItem(notification: Notification) {
    Surface(
        color = SurfaceContainerLow,
        shape = RoundedCornerShape(24.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(
                        if (notification.type == NotificationType.EMERGENCY) Tertiary.copy(alpha = 0.1f)
                        else SecondaryContainer,
                        CircleShape
                    ),
                contentAlignment = Alignment.Center
            ) {
                // Icon based on type
            }
            Column(modifier = Modifier.padding(start = 16.dp).weight(1f)) {
                Text(notification.title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text(notification.description, fontSize = 12.sp, color = OnSurfaceVariant)
                Text(notification.time, fontSize = 10.sp, color = OnSurfaceVariant.copy(alpha = 0.6f), fontWeight = FontWeight.Bold)
            }
            if (!notification.isRead) {
                Surface(
                    modifier = Modifier.size(8.dp),
                    color = Tertiary,
                    shape = CircleShape
                ) {}
            }
        }
    }
}
