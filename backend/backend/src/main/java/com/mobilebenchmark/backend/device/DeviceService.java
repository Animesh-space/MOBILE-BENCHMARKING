package com.mobilebenchmark.backend.device;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {

    @Autowired
    private DeviceRepository deviceRepository;

    // Add Device
    public Device saveDevice(Device device) {
        return deviceRepository.save(device);
    }

    // Get All Devices
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    // Get Device By Id
    public Optional<Device> getDeviceById(Long id) {
        return deviceRepository.findById(id);
    }

    // Delete Device
    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }

    // Update Device
    public Device updateDevice(Long id, Device updatedDevice) {

        updatedDevice.setId(id);

        return deviceRepository.save(updatedDevice);
    }
}