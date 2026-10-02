import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radii.dart';
import '../../../core/widgets/skeleton_box.dart';
import '../../settings/presentation/widgets/edit_text_field_sheet.dart';
import '../data/network_providers.dart';
import '../data/network_repository.dart';
import '../models/network_group.dart';
import '../models/network_member.dart';
import 'widgets/network_member_sheet.dart';

final _emailPattern = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');

class NetworkScreen extends ConsumerStatefulWidget {
  const NetworkScreen({super.key});

  @override
  ConsumerState<NetworkScreen> createState() => _NetworkScreenState();
}

class _NetworkScreenState extends ConsumerState<NetworkScreen> {
  final _scrollController = ScrollController();
  final _searchController = TextEditingController();
  Timer? _debounce;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  int? _selectedGroupId(List<NetworkGroup> groups) {
    if (groups.isEmpty) return null;
    final selected = ref.read(selectedNetworkGroupIdProvider);
    return groups.any((g) => g.id == selected) ? selected : groups.first.id;
  }

  void _onScroll() {
    if (!_scrollController.hasClients) return;
    final groups = ref.read(myNetworkGroupsProvider).valueOrNull ?? const [];
    final groupId = _selectedGroupId(groups);
    if (groupId == null) return;
    final threshold = _scrollController.position.maxScrollExtent - 300;
    if (_scrollController.position.pixels >= threshold) {
      ref.read(networkMembersProvider(groupId).notifier).loadMore();
    }
  }

  void _onSearchChanged(int groupId, String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 400), () {
      ref.read(networkMembersProvider(groupId).notifier).search(value);
    });
  }

  void _selectGroup(int groupId) {
    _debounce?.cancel();
    _searchController.clear();
    ref.read(selectedNetworkGroupIdProvider.notifier).state = groupId;
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _createGroup() async {
    final name = await showEditTextFieldSheet(
      context: context,
      title: 'Nouveau groupe',
      initialValue: '',
    );
    if (name == null || name.isEmpty || !mounted) return;

    try {
      await ref.read(networkRepositoryProvider).createGroup(name);
      ref.invalidate(myNetworkGroupsProvider);
      if (mounted) _showMessage('Groupe créé avec succès.');
    } on ApiException catch (error) {
      if (mounted) _showMessage(error.message);
    }
  }

  Future<void> _addMember(NetworkGroup group) async {
    final email = await showEditTextFieldSheet(
      context: context,
      title: 'Ajouter au groupe « ${group.name} »',
      initialValue: '',
      keyboardType: TextInputType.emailAddress,
      validator: (value) {
        final trimmed = value?.trim() ?? '';
        if (trimmed.isEmpty) return 'Champ requis';
        if (!_emailPattern.hasMatch(trimmed)) return 'Email invalide';
        return null;
      },
    );
    if (email == null || email.isEmpty || !mounted) return;

    try {
      await ref
          .read(networkRepositoryProvider)
          .assignByEmail(groupId: group.id, email: email);
      ref.read(networkMembersProvider(group.id).notifier).refresh();
      if (mounted) _showMessage('Personne assignée avec succès.');
    } on ApiException catch (error) {
      if (!mounted) return;
      _showMessage(error.message);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final asyncGroups = ref.watch(myNetworkGroupsProvider);
    ref.watch(selectedNetworkGroupIdProvider);

    final groups = asyncGroups.valueOrNull ?? const <NetworkGroup>[];
    final selectedId = _selectedGroupId(groups);
    final selectedGroup = selectedId == null
        ? null
        : groups.firstWhere((g) => g.id == selectedId);

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(8, 8, 20, 8),
                  child: _Header(
                    memberCount: selectedId != null &&
                            ref
                                .watch(networkMembersProvider(selectedId))
                                .hasValue
                        ? ref
                            .read(networkMembersProvider(selectedId).notifier)
                            .total
                        : null,
                    onCreateGroup: _createGroup,
                  ),
                ),
                Expanded(
                  child: asyncGroups.when(
                    loading: () => const _ListSkeleton(),
                    error: (error, _) => _ErrorState(
                      message: error is ApiException
                          ? error.message
                          : 'Impossible de charger vos groupes.',
                      onRetry: () => ref.invalidate(myNetworkGroupsProvider),
                    ),
                    data: (groups) {
                      if (groups.isEmpty || selectedGroup == null) {
                        return _NoGroupState(onCreateGroup: _createGroup);
                      }
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (groups.length > 1)
                            _GroupTabs(
                              groups: groups,
                              selectedId: selectedGroup.id,
                              onSelect: _selectGroup,
                            )
                          else
                            _SingleGroupInfo(group: selectedGroup),
                          Padding(
                            padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                            child: TextField(
                              controller: _searchController,
                              onChanged: (value) =>
                                  _onSearchChanged(selectedGroup.id, value),
                              textInputAction: TextInputAction.search,
                              decoration: InputDecoration(
                                hintText: 'Nom, prénom ou code postal',
                                prefixIcon: Icon(Icons.search,
                                    color: colors.textSecondary, size: 20),
                                isDense: true,
                              ),
                            ),
                          ),
                          Expanded(
                            child: _MembersList(
                              group: selectedGroup,
                              scrollController: _scrollController,
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ],
            ),
            if (selectedGroup != null && selectedGroup.isAdmin)
              Positioned(
                right: 20,
                bottom: 24,
                child: _AddMemberFab(onTap: () => _addMember(selectedGroup)),
              ),
          ],
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({required this.memberCount, required this.onCreateGroup});

  final int? memberCount;
  final VoidCallback onCreateGroup;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final countLabel = memberCount == null
        ? ' '
        : '$memberCount membre${memberCount == 1 ? '' : 's'}';

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        IconButton(
          onPressed: () => Navigator.of(context).pop(),
          icon: Icon(Icons.arrow_back, color: colors.primary),
        ),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Mon réseau',
                  style: TextStyle(
                      color: colors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w800)),
              const SizedBox(height: 2),
              Text(countLabel,
                  style:
                      TextStyle(color: colors.textSecondary, fontSize: 12.5)),
            ],
          ),
        ),
        const SizedBox(width: 8),
        Tooltip(
          message: 'Nouveau groupe',
          child: InkWell(
            onTap: onCreateGroup,
            borderRadius: BorderRadius.circular(AppRadii.md),
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                  color: colors.primaryMuted,
                  borderRadius: BorderRadius.circular(AppRadii.md)),
              child: Icon(Icons.group_add_outlined,
                  color: colors.primary, size: 19),
            ),
          ),
        ),
      ],
    );
  }
}

class _SingleGroupInfo extends StatelessWidget {
  const _SingleGroupInfo({required this.group});

  final NetworkGroup group;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          Icon(Icons.hub_outlined, size: 16, color: colors.textSecondary),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              group.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontWeight: FontWeight.w700),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: BoxDecoration(
              color: colors.primaryMuted,
              borderRadius: BorderRadius.circular(999),
            ),
            child: Text(
              group.isAdmin ? 'Administrateur' : 'Membre',
              style: TextStyle(
                  color: colors.primary,
                  fontSize: 10.5,
                  fontWeight: FontWeight.w800),
            ),
          ),
        ],
      ),
    );
  }
}

class _GroupTabs extends StatelessWidget {
  const _GroupTabs({
    required this.groups,
    required this.selectedId,
    required this.onSelect,
  });

  final List<NetworkGroup> groups;
  final int selectedId;
  final ValueChanged<int> onSelect;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return SizedBox(
      height: 34,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: groups.length,
        separatorBuilder: (_, __) => const SizedBox(width: 7),
        itemBuilder: (context, index) {
          final group = groups[index];
          final selected = group.id == selectedId;
          return InkWell(
            onTap: () => onSelect(group.id),
            borderRadius: BorderRadius.circular(AppRadii.md),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: selected ? colors.primary : colors.card,
                border: Border.all(
                    color: selected ? colors.primary : colors.divider),
                borderRadius: BorderRadius.circular(AppRadii.md),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (group.isAdmin) ...[
                    Icon(Icons.shield_outlined,
                        size: 13,
                        color:
                            selected ? colors.onPrimary : colors.textSecondary),
                    const SizedBox(width: 5),
                  ],
                  Text(
                    group.name,
                    style: TextStyle(
                      color: selected ? colors.onPrimary : colors.textSecondary,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _MembersList extends ConsumerWidget {
  const _MembersList({required this.group, required this.scrollController});

  final NetworkGroup group;
  final ScrollController scrollController;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final asyncMembers = ref.watch(networkMembersProvider(group.id));
    final notifier = ref.read(networkMembersProvider(group.id).notifier);
    final isLoadingMore = ref.watch(networkMembersLoadingMoreProvider);

    return asyncMembers.when(
      loading: () => const _ListSkeleton(),
      error: (error, _) => _ErrorState(
        message: error is ApiException
            ? error.message
            : 'Impossible de charger les membres.',
        onRetry: notifier.refresh,
      ),
      data: (members) {
        if (members.isEmpty) {
          return _EmptyMembersState(
            hasQuery: notifier.query.isNotEmpty,
            isAdmin: group.isAdmin,
          );
        }
        return RefreshIndicator(
          color: colors.primary,
          onRefresh: notifier.refresh,
          child: ListView.separated(
            controller: scrollController,
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
            itemCount: members.length + (isLoadingMore ? 1 : 0),
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              if (index >= members.length) return const _CardSkeleton();
              final member = members[index];
              return _MemberCard(
                member: member,
                onTap: () => NetworkMemberSheet.show(context, member: member),
              );
            },
          ),
        );
      },
    );
  }
}

class _MemberCard extends StatelessWidget {
  const _MemberCard({required this.member, required this.onTap});

  final NetworkMember member;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.md),
        child: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(AppRadii.md),
            border: Border.all(color: colors.border),
            boxShadow: [
              BoxShadow(
                  color: colors.shadow,
                  blurRadius: 10,
                  offset: const Offset(0, 3))
            ],
          ),
          child: Row(
            children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: colors.primaryMuted,
                child: Text(
                  member.initials,
                  style: TextStyle(
                      color: colors.primary,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w800),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      member.fullName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                          color: colors.textPrimary,
                          fontSize: 13.5,
                          fontWeight: FontWeight.w700),
                    ),
                    if (member.location.isNotEmpty) ...[
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          Icon(Icons.location_on_outlined,
                              size: 13, color: colors.textSecondary),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              member.location,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                  color: colors.textSecondary, fontSize: 12),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              Icon(Icons.chevron_right, color: colors.textSecondary, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

class _AddMemberFab extends StatelessWidget {
  const _AddMemberFab({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: Container(
          width: 48,
          height: 48,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: colors.primary,
            boxShadow: [
              BoxShadow(
                color: colors.primary.withValues(alpha: 0.4),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Icon(Icons.person_add_alt_1_outlined,
              color: colors.onPrimary, size: 20),
        ),
      ),
    );
  }
}

class _ListSkeleton extends StatelessWidget {
  const _ListSkeleton();

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
      itemCount: 6,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (_, __) => const _CardSkeleton(),
    );
  }
}

class _CardSkeleton extends StatelessWidget {
  const _CardSkeleton();

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: colors.border),
      ),
      child: const Row(
        children: [
          SkeletonBox(width: 36, height: 36),
          SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SkeletonBox(width: 150, height: 12),
              SizedBox(height: 8),
              SkeletonBox(width: 110, height: 11),
            ],
          ),
        ],
      ),
    );
  }
}

class _NoGroupState extends StatelessWidget {
  const _NoGroupState({required this.onCreateGroup});

  final VoidCallback onCreateGroup;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.hub_outlined, size: 38, color: colors.border),
            const SizedBox(height: 12),
            Text(
              'Vous n’appartenez à aucun groupe pour le moment',
              textAlign: TextAlign.center,
              style: TextStyle(
                  color: colors.textPrimary, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 6),
            Text(
              'Vous serez ajouté(e) à un groupe lorsqu’un administrateur vous y invitera, '
              'ou créez le vôtre.',
              textAlign: TextAlign.center,
              style: TextStyle(color: colors.textSecondary, fontSize: 12.5),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: onCreateGroup,
              style: ElevatedButton.styleFrom(
                  backgroundColor: colors.primary,
                  foregroundColor: colors.onPrimary),
              icon: const Icon(Icons.group_add_outlined, size: 18),
              label: const Text('Créer un groupe'),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyMembersState extends StatelessWidget {
  const _EmptyMembersState({required this.hasQuery, required this.isAdmin});

  final bool hasQuery;
  final bool isAdmin;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final message = hasQuery
        ? 'Aucun membre ne correspond à votre recherche'
        : isAdmin
            ? 'Aucun autre membre pour le moment.\nAjoutez des collègues avec le bouton +'
            : 'Aucun autre membre pour le moment';

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.groups_outlined, size: 38, color: colors.border),
            const SizedBox(height: 12),
            Text(
              message,
              textAlign: TextAlign.center,
              style: TextStyle(color: colors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(message,
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.coral)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                  backgroundColor: colors.primary,
                  foregroundColor: colors.onPrimary),
              child: const Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }
}
