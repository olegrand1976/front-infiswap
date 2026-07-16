import '../../../core/utils/date_time_format.dart';

class ReplacementPeriodInput {
  ReplacementPeriodInput({required this.startDate, required this.endDate});

  final DateTime startDate;
  final DateTime endDate;

  Map<String, dynamic> toJson() => {
        'startDate': formatDateYmd(startDate),
        'endDate': formatDateYmd(endDate),
      };
}

class TimeSlotRange {
  const TimeSlotRange({this.startAt, this.endAt});

  final String? startAt;
  final String? endAt;

  bool get isFilled =>
      startAt != null &&
      startAt!.isNotEmpty &&
      endAt != null &&
      endAt!.isNotEmpty;

  Map<String, dynamic> toJson() => {'startAt': startAt, 'endAt': endAt};
}

class ImmediateReplacementPayload {
  const ImmediateReplacementPayload({
    required this.startTime,
    required this.endTime,
    required this.patientCount,
    required this.roleType,
    required this.zipCodes,
    required this.cities,
    required this.careTypeIds,
  });

  final String startTime;
  final String endTime;
  final int patientCount;
  final String roleType;
  final List<String> zipCodes;
  final List<String> cities;
  final List<int> careTypeIds;

  Map<String, dynamic> toJson() => {
        'startTime': startTime,
        'endTime': endTime,
        'patientCount': patientCount,
        'roleType': roleType,
        'zipCodes': zipCodes,
        'cities': cities,
        'careTypes': careTypeIds,
      };
}

class ClassicReplacementPayload {
  const ClassicReplacementPayload({
    required this.periods,
    required this.roleType,
    required this.patientCount,
    required this.zipCodes,
    required this.cities,
    required this.careTypeIds,
    required this.morning,
    required this.evening,
    this.comment,
  });

  final List<ReplacementPeriodInput> periods;
  final String roleType;

  final String patientCount;
  final List<String> zipCodes;
  final List<String> cities;
  final List<int> careTypeIds;
  final TimeSlotRange morning;
  final TimeSlotRange evening;
  final String? comment;

  Map<String, dynamic> toJson() => {
        'periods': periods.map((period) => period.toJson()).toList(),
        'roleType': roleType,
        'patientCount': patientCount,
        'zipCodes': zipCodes,
        'cities': cities,
        'careTypes': careTypeIds,
        'timeSlot': {
          'morning': morning.toJson(),
          'evening': evening.toJson(),
        },
        if (comment != null && comment!.trim().isNotEmpty)
          'comment': comment!.trim(),
      };
}

class UpdateReplacementPayload {
  const UpdateReplacementPayload({
    required this.userId,
    required this.visibility,
    required this.status,
    required this.type,
    required this.experienceYears,
    required this.periods,
    required this.patientCount,
    required this.zipCodes,
    required this.cities,
    required this.careTypeIds,
    required this.country,
    required this.morning,
    required this.evening,
    this.comment,
  });

  final int userId;
  final String visibility;
  final String status;
  final String type;
  final Object? experienceYears;
  final List<ReplacementPeriodInput> periods;
  final int patientCount;
  final List<String> zipCodes;
  final List<String> cities;
  final List<int> careTypeIds;
  final String country;
  final TimeSlotRange morning;
  final TimeSlotRange evening;
  final String? comment;

  Map<String, dynamic> toJson() => {
        'userId': userId,
        'visibility': visibility,
        'status': status,
        'type': type,
        'experienceYears': experienceYears,
        'periods': periods
            .map((period) => {
                  'start_date': formatDateYmd(period.startDate),
                  'end_date': formatDateYmd(period.endDate),
                })
            .toList(),
        'patientCount': patientCount,
        'zipCodes': zipCodes,
        'cities': cities,
        'careTypes': careTypeIds,
        'country': country,
        'timeSlot': {
          'morning': morning.toJson(),
          'evening': evening.toJson(),
        },
        'comment': comment?.trim() ?? '',
      };
}
