package com.example.medicalapp.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import java.text.SimpleDateFormat
import java.util.*

data class Notification(
    val id: String = UUID.randomUUID().toString(),
    val type: NotificationType,
    val title: String,
    val description: String,
    val time: String,
    val isRead: Boolean = false
)

enum class NotificationType {
    EMERGENCY, CLINICAL, ADMIN, DAILY
}

class MainViewModel : ViewModel() {
    private val _isEmergencyActive = MutableStateFlow(false)
    val isEmergencyActive = _isEmergencyActive.asStateFlow()

    private val _emergencyStartTime = MutableStateFlow<Long?>(null)
    val emergencyStartTime = _emergencyStartTime.asStateFlow()

    private val _notifications = MutableStateFlow<List<Notification>>(emptyList())
    val notifications = _notifications.asStateFlow()

    private val _showAlert = MutableStateFlow(false)
    val showAlert = _showAlert.asStateFlow()

    fun setEmergencyActive(active: Boolean) {
        _isEmergencyActive.value = active
        if (active) {
            _emergencyStartTime.value = System.currentTimeMillis()
            addNotification(
                NotificationType.EMERGENCY,
                "Emergency Protocol Activated",
                "A critical seizure protocol has been initiated for a student. Response team notified.",
                SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
            )
        } else {
            _emergencyStartTime.value = null
        }
    }

    fun triggerAlert() {
        _showAlert.value = true
    }

    fun hideAlert() {
        _showAlert.value = false
    }

    fun addNotification(type: NotificationType, title: String, description: String, time: String) {
        _notifications.update { current ->
            listOf(Notification(type = type, title = title, description = description, time = time)) + current
        }
    }

    fun markAllAsRead() {
        _notifications.update { current ->
            current.map { it.copy(isRead = true) }
        }
    }
}
