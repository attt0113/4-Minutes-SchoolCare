package com.example.trymlkit

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.trymlkit.ui.screens.ActiveEmergencyScreen
import com.example.trymlkit.ui.screens.AlertsScreen
import com.example.trymlkit.ui.screens.DashboardScreen
import com.example.trymlkit.ui.screens.AssessmentScreen
import com.example.trymlkit.ui.screens.EmergencyProtocolScreen
import com.example.trymlkit.ui.screens.LoginScreen
import com.example.trymlkit.ui.screens.NotificationsScreen
import com.example.trymlkit.ui.screens.StudentProfileScreen
import com.example.trymlkit.ui.screens.AddProfileScreen
import com.example.trymlkit.viewmodel.MainViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val sharedPrefs = getSharedPreferences("login_prefs", Context.MODE_PRIVATE)
        val isLoggedIn = sharedPrefs.getBoolean("is_logged_in", false)

        setContent {
            val viewModel: MainViewModel = viewModel()
            val navController = rememberNavController()

            NavHost(
                navController = navController, 
                startDestination = if (isLoggedIn) "dashboard" else "login"
            ) {
                composable("login") {
                    LoginScreen(navController = navController)
                }

                composable("dashboard") {
                    DashboardScreen(navController = navController, viewModel = viewModel)
                }

                composable("notifications") {
                    NotificationsScreen(navController = navController, viewModel = viewModel)
                }

                composable("emergency_active") {
                    ActiveEmergencyScreen(navController = navController, viewModel = viewModel)
                }
                
                composable("emergency") {
                    EmergencyProtocolScreen(navController = navController, viewModel = viewModel)
                }

                composable("alerts") {
                    AlertsScreen(navController = navController, viewModel = viewModel)
                }

                composable("assess/{level}") { backStackEntry ->
                    val level = backStackEntry.arguments?.getString("level") ?: "mild"
                    AssessmentScreen(navController = navController, level = level)
                }

                composable("student-profile/{fromLevel}") { backStackEntry ->
                    val fromLevel = backStackEntry.arguments?.getString("fromLevel") ?: "mild"
                    StudentProfileScreen(navController = navController, fromLevel = fromLevel)
                }

                composable("add-profile") {
                    AddProfileScreen(navController = navController, viewModel = viewModel)
                }
            }
        }
    }
}
