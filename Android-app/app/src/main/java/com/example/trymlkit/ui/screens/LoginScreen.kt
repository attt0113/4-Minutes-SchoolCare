package com.example.trymlkit.ui.screens

import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import androidx.navigation.NavController

@Composable
fun LoginScreen(navController: NavController) {
    val context = LocalContext.current
    val sharedPrefs = remember { context.getSharedPreferences("login_prefs", Context.MODE_PRIVATE) }
    
    // Auto-login check: If remembered, go straight to dashboard
    LaunchedEffect(Unit) {
        if (sharedPrefs.getBoolean("is_logged_in", false)) {
            navController.navigate("dashboard") {
                popUpTo("login") { inclusive = true }
            }
        }
    }

    // Get saved emails for suggestions
    val savedEmails = remember { 
        sharedPrefs.getStringSet("saved_emails", emptySet())?.toList() ?: emptyList() 
    }

    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var rememberMe by remember { mutableStateOf(false) }
    var showSuggestions by remember { mutableStateOf(false) }
    var emailError by remember { mutableStateOf<String?>(null) }
    var passwordVisible by remember { mutableStateOf(false) }

    val brandBlue = Color(0xFF1D61E7)
    val brandTeal = Color(0xFF0D9488)
    val textGray = Color(0xFF64748B)
    val textDark = Color(0xFF0F172A)
    val inputBg = Color(0xFFF1F5F9)
    val bgStart = Color(0xFFF8FAFC)
    val bgEnd = Color(0xFFE2E8F0)

    fun handleLogin() {
        // Correct credentials: email: smkmethodist@admin.edu.my, password: admin1234
        if (email == "smkmethodist@admin.edu.my" && password == "admin1234") {
            emailError = null

            val editors = sharedPrefs.edit()
            if (rememberMe) {
                editors.putBoolean("is_logged_in", true)
            }
            
            // Update saved emails list for suggestions
            val newSet = savedEmails.toMutableSet()
            newSet.add(email)
            editors.putStringSet("saved_emails", newSet)
            editors.apply()

            navController.navigate("dashboard") {
                popUpTo("login") { inclusive = true }
            }
        } else {
            emailError = "Invalid email or password"
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Brush.verticalGradient(colors = listOf(bgStart, bgEnd)))
            .statusBarsPadding()
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 24.dp)
        ) {
            Surface(
                modifier = Modifier.size(90.dp),
                shape = RoundedCornerShape(28.dp),
                color = Color.White,
                shadowElevation = 6.dp
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.Shield, null, modifier = Modifier.size(44.dp), tint = brandBlue)
                }
            }
            Spacer(modifier = Modifier.height(20.dp))
            Text("4 minutes", fontSize = 36.sp, fontWeight = FontWeight.Black, color = textDark)
            Text("Secure access to school health records.", fontSize = 14.sp, color = textGray)
        }

        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Surface(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 24.dp),
                shape = RoundedCornerShape(32.dp),
                color = Color.White,
                shadowElevation = 16.dp
            ) {
                Column {
                    Box(modifier = Modifier.fillMaxWidth().height(6.dp).background(Brush.horizontalGradient(colors = listOf(brandBlue, brandTeal))))
                    
                    Column(modifier = Modifier.padding(horizontal = 24.dp, vertical = 20.dp)) {
                        Text("EMAIL ADDRESS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = textGray)
                        Spacer(modifier = Modifier.height(8.dp))

                        Box {
                            TextField(
                                value = email,
                                onValueChange = { 
                                    email = it
                                    showSuggestions = it.isNotEmpty() && savedEmails.any { saved -> saved.startsWith(it, true) }
                                    emailError = null
                                },
                                placeholder = { Text("e.g. teacher@school.edu", color = textGray.copy(0.4f)) },
                                leadingIcon = { Icon(Icons.Default.Email, null, tint = textDark.copy(0.7f), modifier = Modifier.size(18.dp)) },
                                modifier = Modifier.fillMaxWidth().height(54.dp),
                                isError = emailError != null,
                                colors = TextFieldDefaults.colors(
                                    focusedContainerColor = inputBg,
                                    unfocusedContainerColor = inputBg,
                                    focusedIndicatorColor = Color.Transparent,
                                    unfocusedIndicatorColor = Color.Transparent
                                ),
                                shape = RoundedCornerShape(14.dp),
                                singleLine = true
                            )

                            if (showSuggestions) {
                                val filtered = savedEmails.filter { it.startsWith(email, true) }
                                if (filtered.isNotEmpty()) {
                                    Popup(
                                        alignment = Alignment.TopStart,
                                        properties = PopupProperties(focusable = false),
                                        offset = IntOffset(0, 160)
                                    ) {
                                        Surface(
                                            modifier = Modifier.width(280.dp),
                                            shape = RoundedCornerShape(12.dp),
                                            color = Color.White,
                                            shadowElevation = 8.dp
                                        ) {
                                            LazyColumn(modifier = Modifier.heightIn(max = 150.dp)) {
                                                items(filtered) { suggestion ->
                                                    Text(
                                                        text = suggestion,
                                                        modifier = Modifier
                                                            .fillMaxWidth()
                                                            .clickable {
                                                                email = suggestion
                                                                showSuggestions = false
                                                            }
                                                            .padding(12.dp),
                                                        fontSize = 14.sp
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (emailError != null) {
                            Text(emailError!!, color = Color.Red, fontSize = 10.sp, modifier = Modifier.padding(top = 4.dp))
                        }

                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Text("PASSWORD", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = textGray)
                        Spacer(modifier = Modifier.height(8.dp))
                        TextField(
                            value = password,
                            onValueChange = { password = it },
                            placeholder = { Text("••••••••", color = textGray.copy(0.4f), fontSize = 16.sp) },
                            leadingIcon = { Icon(Icons.Default.Lock, null, tint = textDark.copy(0.7f), modifier = Modifier.size(18.dp)) },
                            trailingIcon = {
                                val image = if (passwordVisible) Icons.Filled.Visibility else Icons.Filled.VisibilityOff
                                IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                    Icon(image, null, modifier = Modifier.size(20.dp), tint = textDark.copy(0.7f))
                                }
                            },
                            visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                            modifier = Modifier.fillMaxWidth().height(54.dp),
                            colors = TextFieldDefaults.colors(
                                focusedContainerColor = inputBg,
                                unfocusedContainerColor = inputBg,
                                focusedIndicatorColor = Color.Transparent,
                                unfocusedIndicatorColor = Color.Transparent
                            ),
                            shape = RoundedCornerShape(14.dp),
                            singleLine = true
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(text = "Remember this device", color = textDark.copy(0.8f), fontWeight = FontWeight.SemiBold, fontSize = 14.sp)
                            Switch(
                                checked = rememberMe,
                                onCheckedChange = { rememberMe = it },
                                modifier = Modifier.scale(0.8f),
                                colors = SwitchDefaults.colors(checkedTrackColor = brandBlue)
                            )
                        }

                        Spacer(modifier = Modifier.height(20.dp))

                        Button(
                            onClick = { handleLogin() },
                            modifier = Modifier.fillMaxWidth().height(56.dp),
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = brandBlue)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Secure Login", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Spacer(modifier = Modifier.width(8.dp))
                                Icon(Icons.AutoMirrored.Filled.ArrowForward, null, modifier = Modifier.size(18.dp))
                            }
                        }
                    }
                }
            }
        }

        Text(
            text = "POWERED BY GUARDIAN PULSE TECHNOLOGY",
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            color = textGray.copy(alpha = 0.5f),
            modifier = Modifier.align(Alignment.BottomCenter).padding(bottom = 24.dp),
            letterSpacing = 0.5.sp
        )
    }
}
