package com.meta.wearable.dat.externalsampleapps.cameraaccess.skills

import androidx.lifecycle.ViewModel
import kotlinx.coroutines.flow.StateFlow

class EpicureViewModel : ViewModel() {
    val state: StateFlow<EpicureRepository.State> = EpicureRepository.state
}
