import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/replacement_candidate.dart';
import 'replacements_repository.dart';

class ReplacementCandidatesNotifier
    extends FamilyAsyncNotifier<List<ReplacementCandidate>, int> {
  @override
  Future<List<ReplacementCandidate>> build(int replacementId) async {
    return ref
        .watch(replacementsRepositoryProvider)
        .fetchCandidates(replacementId);
  }

  Future<void> refresh() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() {
      return ref.read(replacementsRepositoryProvider).fetchCandidates(arg);
    });
  }

  Future<void> updateStatus(int responseId, String status) async {
    final previous = state;
    final current = state.valueOrNull;
    if (current != null) {
      state = AsyncData([
        for (final candidate in current)
          if (candidate.responseId == responseId)
            ReplacementCandidate(
              responseId: candidate.responseId,
              status: status,
              statusLabel: replacementCandidateStatusLabel(status),
              respondentName: candidate.respondentName,
              canViewContact: candidate.canViewContact,
              respondentAvatarUrl: candidate.respondentAvatarUrl,
              respondentCity: candidate.respondentCity,
              respondentZipCode: candidate.respondentZipCode,
              respondentPhone: candidate.respondentPhone,
              respondentEmail: candidate.respondentEmail,
              distanceKm: candidate.distanceKm,
              comment: candidate.comment,
              respondedAt: candidate.respondedAt,
            )
          else
            candidate,
      ]);
    }

    try {
      await ref
          .read(replacementsRepositoryProvider)
          .updateCandidateStatus(responseId: responseId, status: status);
      await refresh();
    } catch (error) {
      state = previous;
      rethrow;
    }
  }
}

final replacementCandidatesProvider = AsyncNotifierProvider.family<
    ReplacementCandidatesNotifier, List<ReplacementCandidate>, int>(
  ReplacementCandidatesNotifier.new,
);
