package com.mobilebenchmark.backend.device;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "http://localhost:5173")
public class DeviceController {

    @Autowired
    private DeviceService deviceService;

    // Add Device
    @PostMapping
    public Device addDevice(@RequestBody Device device) {
        return deviceService.saveDevice(device);
    }

    // Get All Devices
    @GetMapping
    public List<Device> getAllDevices() {
        return deviceService.getAllDevices();
    }

    // Get Device By Id
    @GetMapping("/{id}")
    public Optional<Device> getDevice(@PathVariable Long id) {
        return deviceService.getDeviceById(id);
    }

    // Update Device
    @PutMapping("/{id}")
    public Device updateDevice(@PathVariable Long id,
                               @RequestBody Device device) {
        return deviceService.updateDevice(id, device);
    }

    // Delete Device
    @DeleteMapping("/{id}")
    public void deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
    }
}