
package com.mobilebenchmark.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BenchmarkRunRequest {

    private String applicationName;

    private String testType;

    private List<String> tools;

    private Long userId;

    private Long deviceId;

    private Long benchmarkId;
}