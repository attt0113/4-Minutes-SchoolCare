package com.example.trymlkit.viewmodel

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.map
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
    
    private val _estimatedArrivalMillis = MutableStateFlow<Long?>(null)
    val estimatedArrivalMillis = _estimatedArrivalMillis.asStateFlow()

    private val _notifications = MutableStateFlow<List<Notification>>(emptyList())
    val notifications = _notifications.asStateFlow()

    val hasUnreadNotifications = _notifications.map { list ->
        list.any { !it.isRead }
    }

    private val _showAlert = MutableStateFlow(false)
    val showAlert = _showAlert.asStateFlow()

    fun setEmergencyActive(active: Boolean) {
        _isEmergencyActive.value = active
        if (active) {
            val now = System.currentTimeMillis()
            _emergencyStartTime.value = now
            _estimatedArrivalMillis.value = now + (10 * 60 * 1000)
            addNotification(
                NotificationType.EMERGENCY,
                "Emergency Active",
                "A critical protocol has been initiated. Emergency responders have been notified.",
                SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
            )
        } else {
            _emergencyStartTime.value = null
            _estimatedArrivalMillis.value = null
        }
    }

    fun endEmergency() {
        setEmergencyActive(false)
    }

    fun triggerAlert() {
        _showAlert.value = true
    }

    fun hideAlert() {
        _showAlert.value = false
    }

    fun addNotification(type: NotificationType, title: String, description: String, time: String) {
        _notifications.update { current ->
            listOf(Notification(type = type, title = title, description = description, time = time, isRead = false)) + current
        }
    }

    fun markAllAsRead() {
        _notifications.update { current ->
            current.map { it.copy(isRead = true) }
        }
    }
}
