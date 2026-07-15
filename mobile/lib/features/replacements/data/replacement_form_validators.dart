import '../models/create_replacement_payload.dart';

String? validateImmediateReplacementForm({
  required String? startTime,
  required String? endTime,
  required String patientCount,
  required String? roleType,
  required List<String> zipCodes,
  required List<String> cities,
  required List<int> careTypeIds,
}) {
  if (startTime == null || startTime.isEmpty || endTime == null || endTime.isEmpty) {
    return 'Veuillez renseigner les heures de début et de fin.';
  }

  if (endTime.compareTo(startTime) <= 0) {
    return "L'heure de fin doit être postérieure à l'heure de début.";
  }

  final patients = int.tryParse(patientCount);
  if (patients == null || patients < 1) {
    return 'Veuillez indiquer un nombre de patients valide.';
  }

  if (roleType == null || roleType.isEmpty) {
    return 'Veuillez sélectionner votre type de professionnel.';
  }

  if (zipCodes.isEmpty) {
    return 'Veuillez ajouter au moins un code postal.';
  }

  if (cities.isEmpty) {
    return 'Veuillez ajouter au moins une ville.';
  }

  if (careTypeIds.isEmpty) {
    return 'Veuillez sélectionner au moins un type de soin.';
  }

  return null;
}

String? validateClassicReplacementForm({
  required String? roleType,
  required List<ReplacementPeriodInput> periods,
  required String patientCount,
  required List<String> zipCodes,
  required List<int> careTypeIds,
  required TimeSlotRange morning,
  required TimeSlotRange evening,
}) {
  if (roleType == null || roleType.isEmpty) {
    return 'Veuillez sélectionner votre type de professionnel.';
  }

  if (periods.isEmpty) {
    return 'Veuillez sélectionner au moins une période de remplacement.';
  }

  for (final period in periods) {
    if (period.endDate.isBefore(period.startDate)) {
      return 'La date de fin doit être postérieure ou égale à la date de début.';
    }
  }

  if (!RegExp(r'^\d+$').hasMatch(patientCount)) {
    return 'Veuillez indiquer un nombre de patients valide.';
  }

  if (zipCodes.isEmpty) {
    return 'Veuillez ajouter au moins un code postal.';
  }

  if (careTypeIds.isEmpty) {
    return 'Veuillez sélectionner au moins un type de soin.';
  }

  if (!morning.isFilled && !evening.isFilled) {
    return 'Veuillez renseigner au moins un créneau horaire (matin ou soir).';
  }

  return null;
}
