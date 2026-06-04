package com.example.trymlkit.ui.screens

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.trymlkit.viewmodel.MainViewModel
import kotlinx.coroutines.launch
import kotlin.math.ceil

private val bgLight = Color(0xFFF8FAFC)
private val textGray = Color(0xFF64748B)
private val alertRed = Color(0xFFC00000)

@Composable
fun EmergencyProtocolScreen(navController: NavController, viewModel: MainViewModel) {
    val scope = rememberCoroutineScope()
    val holdProgress = remember { Animatable(0f) }
    
    // Scale factor for the button when holding (from 1.0 to 1.1)
    val buttonScale = 1f + (holdProgress.value * 0.1f)

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(bgLight)
            .statusBarsPadding()
    ) {
        // Back Button
        IconButton(
            onClick = { navController.popBackStack() },
            modifier = Modifier
                .padding(24.dp)
                .size(48.dp)
                .shadow(4.dp, CircleShape)
                .background(Color.White, CircleShape)
        ) {
            Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.Black)
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                "EMERGENCY PROTOCOL",
                fontSize = 22.sp,
                fontWeight = FontWeight.ExtraBold,
                color = alertRed,
                letterSpacing = 0.5.sp
            )

            Spacer(Modifier.height(8.dp))

            Text(
                "Activate immediate emergency\nresponse across school grounds.",
                textAlign = TextAlign.Center,
                fontSize = 16.sp,
                color = textGray,
                lineHeight = 22.sp
            )

            Spacer(Modifier.height(48.dp))

            // Red Alert Circular UI
            Box(contentAlignment = Alignment.Center) {
                // Outer Rings (Background)
                Canvas(modifier = Modifier.size(280.dp)) {
                    drawArc(
                        color = Color.LightGray.copy(alpha = 0.2f),
                        startAngle = 0f,
                        sweepAngle = 360f,
                        useCenter = false,
                        style = Stroke(width = 1.dp.toPx())
                    )
                }

                // Charging Progress Bar (Matches button shape)
                Canvas(modifier = Modifier.size(240.dp)) {
                    // Gray background track
                    drawArc(
                        color = Color.LightGray.copy(alpha = 0.3f),
                        startAngle = -90f,
                        sweepAngle = 360f,
                        useCenter = false,
                        style = Stroke(width = 10.dp.toPx(), cap = StrokeCap.Round)
                    )
                    // Active red progress
                    drawArc(
                        color = alertRed,
                        startAngle = -90f,
                        sweepAngle = 360f * holdProgress.value,
                        useCenter = false,
                        style = Stroke(width = 10.dp.toPx(), cap = StrokeCap.Round)
                    )
                }

                // Inner Glow/Shadow and Red Circle (The Button)
                Box(
                    modifier = Modifier
                        .size(220.dp)
                        .graphicsLayer {
                            scaleX = buttonScale
                            scaleY = buttonScale
                        }
                        .shadow(40.dp, CircleShape, spotColor = alertRed)
                        .background(alertRed, CircleShape)
                        .pointerInput(Unit) {
                            awaitEachGesture {
                                awaitFirstDown()
                                val job = scope.launch {
                                    holdProgress.animateTo(
                                        targetValue = 1f,
                                        animationSpec = tween(durationMillis = 3000, easing = LinearEasing)
                                    )
                                    if (holdProgress.value == 1f) {
                                        viewModel.setEmergencyActive(true)
                                        navController.navigate("emergency_active")
                                    }
                                }
                                waitForUpOrCancellation()
                                job.cancel()
                                scope.launch {
                                    holdProgress.animateTo(
                                        targetValue = 0f,
                                        animationSpec = tween(durationMillis = 300)
                                    )
                                }
                            }
                        },
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            "!",
                            fontSize = 80.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                        Text(
                            "RED ALERT",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.White
                        )
                    }
                }
            }

            Spacer(Modifier.height(64.dp))

            // Hold to Initiate Button
            Surface(
                shape = RoundedCornerShape(100.dp),
                color = if (holdProgress.value > 0f) alertRed.copy(alpha = 0.1f) else Color(0xFFE2E8F0),
                modifier = Modifier.padding(bottom = 24.dp)
            ) {
                val remainingSeconds = ceil(3 * (1f - holdProgress.value)).toInt().coerceIn(1, 3)
                Text(
                    if (holdProgress.value > 0f) "Alerting in ${remainingSeconds}s" else "HOLD TO INITIATE",
                    modifier = Modifier.padding(horizontal = 32.dp, vertical = 12.dp),
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = if (holdProgress.value > 0f) alertRed else Color.Black
                )
            }

            Text(
                buildAnnotatedString {
                    append("Alerting responders in ")
                    withStyle(style = SpanStyle(color = alertRed, fontWeight = FontWeight.Bold)) {
                        append("04:00")
                    }
                    append(" minutes.")
                },
                fontSize = 14.sp,
                color = textGray
            )

            Spacer(Modifier.height(48.dp))

            // Bottom Status Card and Responders
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Critical Status Card
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = Color.White,
                    modifier = Modifier
                        .weight(1.3f)
                        .height(110.dp)
                        .shadow(2.dp, RoundedCornerShape(20.dp))
                ) {
                    Row {
                        // Left red bar
                        Box(
                            modifier = Modifier
                                .width(6.dp)
                                .fillMaxHeight()
                                .background(
                                    alertRed,
                                    RoundedCornerShape(topStart = 20.dp, bottomStart = 20.dp)
                                )
                        )
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(
                                "CRITICAL STATUS",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = alertRed
                            )
                            Spacer(Modifier.height(4.dp))
                            Text(
                                "System will automatically notify counselors, teachers, and students.",
                                fontSize = 11.sp,
                                color = Color.DarkGray,
                                lineHeight = 15.sp
                            )
                        }
                    }
                }

                Spacer(Modifier.width(12.dp))

                // Responders Ready
                Column(
                    modifier = Modifier.weight(0.7f),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(contentAlignment = Alignment.CenterStart, modifier = Modifier.height(40.dp)) {
                        ResponderAvatar(Color(0xFF99F6E4), 0.dp) // mildGreen like color
                        ResponderAvatar(Color(0xFFBAE6FD), 20.dp) // blue like color
                        Box(
                            modifier = Modifier
                                .offset(x = 40.dp)
                                .size(32.dp)
                                .background(Color(0xFF1D61E7), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("+12", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "RESPONDERS READY",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF475569),
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

@Composable
fun ResponderAvatar(color: Color, offset: androidx.compose.ui.unit.Dp) {
    Box(
        modifier = Modifier
            .offset(x = offset)
            .size(32.dp)
            .shadow(1.dp, CircleShape)
            .background(Color.White, CircleShape)
            .padding(2.dp)
            .clip(CircleShape)
            .background(color),
        contentAlignment = Alignment.Center
    ) {
        Icon(Icons.Default.Person, null, modifier = Modifier.size(20.dp), tint = Color.White.copy(alpha = 0.8f))
    }
}