package com.example.trymlkit.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

private val bgLight = Color(0xFFF8FAFC)
private val brandBlue = Color(0xFF1D61E7)
private val textDark = Color(0xFF0F172A)
private val textGray = Color(0xFF64748B)

@Composable
fun AssessmentScreen(navController: NavController, level: String) {
    val isMild = level == "mild"
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(bgLight)
    ) {
        // Custom Top Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                onClick = { navController.popBackStack() },
                shape = CircleShape,
                color = Color(0xFFF1F5F9),
                modifier = Modifier.size(40.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(Icons.Default.ArrowBack, null, modifier = Modifier.size(20.dp), tint = textDark)
                }
            }
            Spacer(Modifier.width(16.dp))
            Text(
                if (isMild) "Level 1 — Mild complaint" else "Level 2 — Moderate attention",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = textDark
            )
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(horizontal = 24.dp, vertical = 8.dp)
        ) {
            // Status Alert Card
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 16.dp),
                shape = RoundedCornerShape(12.dp),
                color = if (isMild) Color(0xFFE2E8F0).copy(alpha = 0.5f) else Color(0xFFFFFBEB)
            ) {
                Row(
                    modifier = Modifier
                        .border(
                            width = 2.dp,
                            color = if (isMild) Color(0xFF0F766E) else Color(0xFFF59E0B),
                            shape = RoundedCornerShape(12.dp, 0.dp, 0.dp, 12.dp)
                        )
                        .padding(16.dp),
                    verticalAlignment = Alignment.Top
                ) {
                    Icon(
                        if (isMild) Icons.Default.CheckCircle else Icons.Default.Warning,
                        null,
                        tint = if (isMild) Color(0xFF0F766E) else Color(0xFFF59E0B),
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(Modifier.width(16.dp))
                    Column {
                        Text(
                            if (isMild) "Student does not need to go home." else "STATUS ALERT",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = if (isMild) Color(0xFF0F766E) else Color(0xFF92400E)
                        )
                        Text(
                            if (isMild) "Manage in school." else "Student should be sent to the office. Notify counselor.",
                            fontSize = 13.sp,
                            color = if (isMild) Color(0xFF0F766E) else Color(0xFF92400E)
                        )
                    }
                }
            }

            SectionTitle(if (isMild) "STEP 1 — AI SCAN" else "STEP 1 — DIAGNOSTIC")
            
            Button(
                onClick = { navController.navigate("student-profile/$level") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .shadow(4.dp, RoundedCornerShape(12.dp)),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = brandBlue)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(if (isMild) Icons.Default.PhotoCamera else Icons.Default.CenterFocusStrong, null)
                    Spacer(Modifier.width(8.dp))
                    Text("AI Scan", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
            }

            Spacer(Modifier.height(24.dp))

            SectionTitle("AI SUGGESTION")
            
            Surface(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                color = Color.White,
                border = BorderStroke(1.dp, Color(0xFFE2E8F0))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    if (isMild) {
                        SuggestionItem("1.", "Let the student rest.")
                        SuggestionItem("2.", "Provide water.")
                        SuggestionItem("3.", "Monitor their condition closely.")
                    } else {
                        SuggestionItemBox(1, "Escort student to the clinic.")
                        SuggestionItemBox(2, "Monitor for worsening symptoms.")
                        SuggestionItemBox(3, "Prepare incident documentation.")
                        
                        Spacer(Modifier.height(12.dp))
                        
                        // Alert Box for Moderate
                        Surface(
                            color = Color(0xFFFEE2E2),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier
                                    .border(2.dp, Color(0xFFDC2626), RoundedCornerShape(8.dp, 0.dp, 0.dp, 8.dp))
                                    .padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.ReportProblem, null, tint = Color(0xFFDC2626), modifier = Modifier.size(20.dp))
                                Spacer(Modifier.width(12.dp))
                                Text(
                                    "AI Detection: Student is ALLERGIC to Ibuprofen. Do not administer.",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF991B1B),
                                    lineHeight = 16.sp
                                )
                            }
                        }
                        
                        Spacer(Modifier.height(12.dp))
                        
                        Surface(
                            color = Color(0xFFEFF6FF),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.fillMaxWidth(),
                            border = BorderStroke(1.dp, Color(0xFFDBEAFE))
                        ) {
                            Text(
                                "If symptoms persist after 15 minutes, proceed to Step 3.",
                                modifier = Modifier.padding(12.dp),
                                fontSize = 12.sp,
                                color = Color(0xFF1E40AF)
                            )
                        }
                    }
                }
            }

            if (!isMild) {
                Spacer(Modifier.height(24.dp))
                SectionTitle("STEP 2 — OFFICE TRANSFER")
                Button(
                    onClick = { /* Send to Office */ },
                    modifier = Modifier.fillMaxWidth().height(56.dp).shadow(4.dp, RoundedCornerShape(12.dp)),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = brandBlue)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.TransferWithinAStation, null)
                        Spacer(Modifier.width(8.dp))
                        Text("Send to Office", fontWeight = FontWeight.Bold)
                    }
                }
                Text(
                    "This will notify the counselor and update student status to 'In Transit'.",
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    textAlign = TextAlign.Center,
                    fontSize = 11.sp,
                    color = textGray,
                    fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                )

                Spacer(Modifier.height(24.dp))
                SectionTitle("STEP 3 — IF STILL UNWELL")
                Button(
                    onClick = { /* Call Guardian */ },
                    modifier = Modifier.fillMaxWidth().height(56.dp).shadow(4.dp, RoundedCornerShape(12.dp)),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDC2626))
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Phone, null)
                        Spacer(Modifier.width(8.dp))
                        Text("Call guardian", fontWeight = FontWeight.Bold)
                    }
                }
                Text(
                    "Contact verified guardian only. Do not let student call.",
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    textAlign = TextAlign.Center,
                    fontSize = 11.sp,
                    color = textGray
                )
            }

            Spacer(Modifier.height(40.dp))
            
            Button(
                onClick = { navController.popBackStack() },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
                    .shadow(8.dp, RoundedCornerShape(12.dp)),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = brandBlue)
            ) {
                Text(if (isMild) "Confirm & Log" else "Confirm & Send", fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
            }
            
            Spacer(Modifier.height(40.dp))
        }
    }
}

@Composable
fun SectionTitle(title: String) {
    Text(
        text = title,
        fontSize = 13.sp,
        fontWeight = FontWeight.Bold,
        color = textDark,
        letterSpacing = 0.5.sp,
        modifier = Modifier.padding(bottom = 12.dp)
    )
}

@Composable
fun SuggestionItem(number: String, text: String) {
    Row(modifier = Modifier.padding(vertical = 4.dp)) {
        Text(number, fontWeight = FontWeight.Bold, color = brandBlue, modifier = Modifier.width(24.dp))
        Text(text, fontSize = 14.sp, color = textDark)
    }
}

@Composable
fun SuggestionItemBox(number: Int, text: String) {
    Surface(
        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
        color = Color(0xFFF1F5F9).copy(alpha = 0.5f),
        shape = RoundedCornerShape(8.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                modifier = Modifier.size(24.dp),
                color = brandBlue,
                shape = CircleShape
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Text(number.toString(), color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
            Spacer(Modifier.width(12.dp))
            Text(text, fontSize = 14.sp, color = textDark)
        }
    }
}
