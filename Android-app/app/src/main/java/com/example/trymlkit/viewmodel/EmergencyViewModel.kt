package com.example.trymlkit.viewmodel

import androidx.compose.runtime.*
import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID

class EmergencyViewModel : ViewModel() {
    var isEmergencyActive by mutableStateOf(false)
    var emergencyStartTime by mutableStateOf<Long?>(null)

    private val _notifications = MutableStateFlow<List<Notification>>(emptyList())
    val notifications = _notifications.asStateFlow()

    fun addNotification(type: NotificationType, title: String, desc: String) {
        val newNotif = Notification(
            id = UUID.randomUUID().toString(),
            type = type,
            title = title,
            description = desc,
            time = SimpleDateFormat("hh:mm a", Locale.US).format(Date())
        )
        _notifications.value = listOf(newNotif) + _notifications.value
    }

    fun startEmergency() {
        if (!isEmergencyActive) {
            isEmergencyActive = true
            emergencyStartTime = System.currentTimeMillis()
            addNotification(NotificationType.EMERGENCY, "Emergency Protocol Activated", "Critical seizure protocol initiated.")
        }
    }

    fun endEmergency() {
        isEmergencyActive = false
        emergencyStartTime = null
    }
}
