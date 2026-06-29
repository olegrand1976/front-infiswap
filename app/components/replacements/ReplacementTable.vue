<template>
    <div class="min-w-0 w-full max-w-full overflow-x-hidden">
        <div class="hidden min-w-0 w-full lg:block">
            <Table>
                <TableHeader class="w-full">
                    <TableRow :class="['min-w-0 gap-2 grid rounded-t-lg border-none', gridClass]">
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Jour
                        </TableHead>
                        <TableHead class="bg-primary w-full grid grid-cols-3 justify-center items-center text-white text-xs">
                            <div class="text-center">
                                Matin
                            </div>
                            <div class="text-center">
                                Midi
                            </div>
                            <div class="text-center">
                                Soir
                            </div>
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Codes postaux
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Ville(s)
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Types de soins
                        </TableHead>
                        <TableHead
                            v-if="type === 'groups'"
                            class="bg-primary w-full flex justify-center items-center text-white text-xs"
                        >
                            Créateur
                        </TableHead>
                        <TableHead
                            v-if="type === 'groups'"
                            class="bg-primary w-full flex justify-center items-center text-white text-xs"
                        >
                            Groupe
                        </TableHead>
                        <TableHead
                            v-if="type === ''"
                            class="bg-primary w-full flex justify-center items-center text-white text-xs"
                        >
                            Catégorie
                        </TableHead>
                        <TableHead
                            v-if="type === ''"
                            class="bg-primary w-full flex justify-center items-center text-white text-xs"
                        >
                            Institution
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody class="rounded-b-lg">
                    <ReplacementTableSkeleton
                        v-if="loading"
                        :type="type"
                        :count="10"
                    />

                    <div
                        v-else-if="replacements.length === 0"
                        class="text-center text-gray-500 py-8"
                    >
                        Aucun résultat n'est trouvé
                    </div>

                    <template v-else>
                        <TableRow
                            v-for="r in replacements"
                            :key="r.id"
                            :class="['gap-2 grid border border-none overflow-x-hidden relative', gridClass]"
                        >
                            <div
                                v-if="isUrgentReplacement(r) && r.status === 'open' && !hasConfirmedSubstitute(r)"
                                :class="[cn('text-xs absolute -top-1 left-0 z-10 text-[0.7rem] font-bold px-2 py-0.5 rounded-br-sm animate-pulse shadow-md',
                                            { 'bg-primary text-white': r.type === 'immediate' && !hasConfirmedSubstitute(r) && r.status === 'open' })]"
                            >
                                URGENT
                            </div>
                            <div
                                v-if="isClosed(r)"
                                :class="['text-xs absolute z-10 text-[0.7rem] font-bold px-2 py-0.5 rounded-br-sm shadow-md bg-gray-600 text-white',
                                         isUrgentReplacement(r) && hasConfirmedSubstitute(r) ? '-top-1 left-15' : '-top-1 left-0']"
                            >
                                FERMÉ
                            </div>

                            <div
                                v-if="isNew(r)"
                                class="absolute z-10 font-bold px-2 py-0.5 rounded-md shadow-sm tracking-wide uppercase bg-primarytech text-white text-[10px]"
                                :class="[
                                    isUrgentReplacement(r) || isClosed(r) ? 'top-8 left-20' : 'top-8 left-4',
                                ]"
                            >
                                NEW
                            </div>
                            <TableCell :class="[cn('flex flex-col justify-center items-center bg-[#F1F2F7] xl:text-[0.7em] lg:text-[0.65em]', { 'flex-col': r.periods.length > 0 })]">
                                <template v-if="r.periods.length > 0">
                                    <div
                                        v-for="(period, idx) in r.periods.slice(0, 2)"
                                        :key="idx"
                                        class="flex flex-col 2xl:flex-row items-center"
                                    >
                                        <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                            <span>{{ formatDate(period.start_date) }}</span>
                                        </div>
                                        <span class="flex items-center">au</span>
                                        <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                            <span>{{ formatDate(period.end_date) }}</span>
                                        </div>
                                    </div>
                                    <div
                                        class="mt-1 text-xs font-semibold text-primary cursor-pointer"
                                        @click="emit('show-periods', r.periods)"
                                    >
                                        Voir tout
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                        <span>{{ formatDate(r.start_date) }}</span>
                                    </div>
                                    <span class="flex items-center">au</span>
                                    <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                        <span>{{ formatDate(r.end_date) }}</span>
                                    </div>
                                </template>
                            </TableCell>

                            <TableCell class="bg-[#F1F2F7] text-xs grid grid-cols-3 place-items-center">
                                <div>
                                    <CircleCheck
                                        v-if="hasShift(r, 'morning')"
                                        class="h-6 text-green-500"
                                    />
                                </div>
                                <div>
                                    <CircleCheck
                                        v-if="hasShift(r, 'afternoon')"
                                        class="h-6 text-green-500"
                                    />
                                </div>
                                <div>
                                    <CircleCheck
                                        v-if="hasShift(r, 'evening')"
                                        class="h-6 text-green-500"
                                    />
                                </div>
                            </TableCell>

                            <TableCell class="bg-[#F1F2F7] text-xs">
                                <div class="flex bg-[#E4E7F4] truncate h-10 rounded mt-3 items-center overflow-hidden">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                    <span
                                                        v-for="(zip, zi) in parseJson(r.zip_codes)"
                                                        :key="zi"
                                                        :class="[cn('mr-1', { 'text-success font-bold': isZipCodeHighlighted(zip) })]"
                                                    >{{ zip }}{{ zi < parseJson(r.zip_codes).length - 1 ? ',' : '' }}</span>
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span
                                                    v-for="(zip, zi) in parseJson(r.zip_codes)"
                                                    :key="zi"
                                                    :class="[cn('mr-1', { 'text-success font-bold': isZipCodeHighlighted(zip) })]"
                                                >{{ zip }}{{ zi < parseJson(r.zip_codes).length - 1 ? ',' : '' }}</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableCell>

                            <TableCell class="bg-[#F1F2F7] text-xs">
                                <div class="flex bg-[#E4E7F4] truncate w-full h-10 rounded mt-3 items-center overflow-hidden">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <p class="truncate w-full text-start px-2 pt-3 h-10 rounded">
                                                    <span
                                                        v-for="(city, ci) in parseJson(r.cities)"
                                                        :key="ci"
                                                        :class="[cn('mr-1', { 'text-success font-bold': hasMatchingCity(city) })]"
                                                    >{{ city }}{{ ci < parseJson(r.cities).length - 1 ? ',' : '' }}</span>
                                                </p>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <span
                                                    v-for="(city, ci) in parseJson(r.cities)"
                                                    :key="ci"
                                                    :class="[cn('mr-1', { 'text-success font-bold': hasMatchingCity(city) })]"
                                                >{{ city }}{{ ci < parseJson(r.cities).length - 1 ? ',' : '' }}</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableCell>

                            <TableCell class="bg-gray-100 text-xs pt-5">
                                <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-start px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger>{{ getUniqueValues(r.care_types, ct => ct.name).join(', ') }}</TooltipTrigger>
                                            <TooltipContent>{{ getUniqueValues(r.care_types, ct => ct.name).join(', ') }}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableCell>

                            <TableCell
                                v-if="type === 'groups'"
                                class="bg-gray-100 text-xs pt-5"
                            >
                                <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-start px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis">
                                    {{ getCreatorInfo(r, 'name') || '—' }}
                                </div>
                            </TableCell>
                            <TableCell
                                v-if="type === 'groups'"
                                class="bg-gray-100 text-xs pt-5"
                            >
                                <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-start px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis">
                                    {{ getCreatorInfo(r, 'group') || '—' }}
                                </div>
                            </TableCell>

                            <TableCell
                                v-if="type === ''"
                                class="bg-gray-100 text-xs pt-5"
                            >
                                <div class="pt-3 h-10 rounded bg-[#E4E7F4] text-center px-3 items-center overflow-hidden whitespace-nowrap text-ellipsis">
                                    {{ roles[r.role_type] }}
                                </div>
                            </TableCell>

                            <TableCell
                                v-if="type === ''"
                                class="bg-gray-100 text-xs pt-5"
                            >
                                <div class="pt-3 h-10 rounded bg-[#E4E7F4] flex items-center justify-center px-3">
                                    <template v-if="r.institution || r.user?.institution">
                                        <div
                                            v-if="getInstitutionLogoUrl(r)"
                                            class="w-8 h-8 rounded bg-white flex items-center justify-center"
                                        >
                                            <img
                                                :src="getInstitutionLogoUrl(r)"
                                                :alt="getInstitutionName(r)"
                                                class="max-w-full max-h-full object-contain"
                                            >
                                        </div>
                                        <span
                                            v-else
                                            class="text-xs truncate"
                                            :title="getInstitutionName(r)"
                                        >
                                            {{ getInstitutionName(r) }}
                                        </span>
                                    </template>
                                    <span
                                        v-else
                                        class="text-gray-400"
                                    >—</span>
                                </div>
                            </TableCell>

                            <TableCell class="text-xs flex items-center justify-end gap-2 bg-[#F1F2F7] overflow-x-hidden py-3 px-2">
                                <template v-if="type === 'me'">
                                    <ReplacementBoostButton
                                        v-if="canBoostReplacement(r, type) && !isActivelyBoosted(r)"
                                        variant="table"
                                        @boost="openBoostPreview(r)"
                                    />
                                    <ReplacementBoostStars
                                        v-else-if="isActivelyBoosted(r)"
                                        plain
                                        clickable
                                        @click="openBoostActive(r)"
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger class="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200/80 transition-colors">
                                            <Ellipsis class="h-5 w-5 text-gray-700" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent class="w-48">
                                            <DropdownMenuItem as-child>
                                                <NuxtLink
                                                    :href="`/dashboard/replacements/detail/${r.id}`"
                                                    class="flex items-center space-x-2 text-sm"
                                                >
                                                    <Eye class="h-4 w-4" />
                                                    <span>Voir</span>
                                                </NuxtLink>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                class="flex items-center space-x-2 text-sm"
                                                @click="emit('open-edit', r)"
                                            >
                                                <SquarePen class="h-4 w-4" />
                                                <span>Modifier</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                v-if="currentUserId === r.user_id && !hasConfirmedSubstitute(r)"
                                                class="flex items-center space-x-2 text-sm"
                                                @click="emit('select-replacement', r)"
                                            >
                                                <X class="h-4 w-4" />
                                                <span>Fermer</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </template>
                                <template v-else>
                                    <ReplacementBoostStars
                                        v-if="isActivelyBoosted(r)"
                                        size="sm"
                                    />
                                    <Button
                                        class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white mx-auto justify-center items-center"
                                        :href="`/dashboard/replacements/detail/${r.id}`"
                                    >
                                        <Eye class="h-6 mt-1" />
                                    </Button>
                                    <Button
                                        v-if="currentUserId === r.user_id && !hasConfirmedSubstitute(r) && r.status === 'closed'"
                                        class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white mx-auto justify-center items-center"
                                        @click="openCloseDialog(r)"
                                    >
                                        <X class="h-6 mt-1" />
                                    </Button>
                                </template>
                            </TableCell>

                            <span class="bg-white h-[0.01em]" />
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>

        <div class="lg:hidden">
            <Table>
                <TableHeader class="w-full">
                    <TableRow class="grid grid-cols-3 overflow-x-hidden gap-1 rounded-t-lg border-none">
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Date
                        </TableHead>
                        <TableHead
                            v-if="type === 'me'"
                            class="bg-primary w-full flex justify-center items-center text-white text-xs"
                        >
                            Localité
                        </TableHead>
                        <TableHead class="bg-primary w-full flex justify-center items-center text-white text-xs">
                            Action
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody class="rounded-b-lg">
                    <ReplacementTableSkeleton
                        v-if="loading"
                        :type="type"
                        :count="10"
                    />

                    <div
                        v-else-if="replacements.length === 0"
                        class="text-center text-gray-500 py-8"
                    >
                        Aucun résultat n'est trouvé
                    </div>

                    <template v-else>
                        <TableRow
                            v-for="r in replacements"
                            :key="`mob-${r.id}`"
                            class="grid grid-cols-3 gap-1 border border-none overflow-x-hidden relative gap-y-2"
                        >
                            <div
                                v-if="isUrgentReplacement(r) && r.status === 'open' && !hasConfirmedSubstitute(r)"
                                :class="[cn('text-xs absolute -top-1 left-0 z-10 text-[0.7rem] font-bold px-2 py-0.5 rounded-br-sm animate-pulse shadow-md',
                                            { 'bg-primary text-white': r.type === 'immediate' && !hasConfirmedSubstitute(r) && r.status === 'open' })]"
                            >
                                URGENT
                            </div>
                            <div
                                v-if="isClosed(r)"
                                :class="['text-xs absolute z-10 text-[0.7rem] font-bold px-2 py-0.5 rounded-br-sm shadow-md bg-yellow-400 text-red-600',
                                         isUrgentReplacement(r) && hasConfirmedSubstitute(r) ? '-top-1 left-15' : '-top-1 left-0']"
                            >
                                FERMÉ
                            </div>

                            <TableCell class="flex flex-col items-center bg-[#F1F2F7] text-[0.75em] py-6">
                                <template v-if="r.periods.length > 0 && r.start_date == null && r.end_date == null">
                                    <div
                                        v-for="(period, idx) in r.periods.slice(0, 1)"
                                        :key="idx"
                                        class="flex flex-col items-center mb-2"
                                    >
                                        <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                            <span>{{ formatDate(period.start_date) }}</span>
                                        </div>
                                        <span class="flex items-center">au</span>
                                        <div class="flex h-8 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                            <span>{{ formatDate(period.end_date) }}</span>
                                        </div>
                                    </div>
                                    <div
                                        class="mt-1 text-xs font-semibold text-primary cursor-pointer"
                                        @click="emit('show-periods', r.periods)"
                                    >
                                        Voir tout
                                    </div>
                                </template>
                                <template v-else-if="r.start_date !== r.end_date && r.start_date != null && r.end_date != null">
                                    <div class="flex h-6 py-1 px-2 mb-1 rounded bg-[#E4E7F4] justify-center items-center">
                                        <span>{{ formatDate(r.start_date) }}</span>
                                    </div>
                                    <span class="text-xs mb-1">au</span>
                                    <div class="flex h-6 py-1 px-2 rounded bg-[#E4E7F4] justify-center items-center">
                                        <span>{{ formatDate(r.end_date) }}</span>
                                    </div>
                                </template>
                                <template v-else>
                                    <div
                                        class="flex h-full w-full justify-center items-center"
                                        style="min-height: 3rem;"
                                    >
                                        <span class="bg-[#E4E7F4] rounded px-2 py-1">{{ formatDate(r.start_date) }}</span>
                                    </div>
                                </template>
                            </TableCell>

                            <TableCell class="bg-[#F1F2F7] flex flex-col justify-center w-full items-center text-xs px-2 py-4">
                                <div class="bg-[#E4E7F4] rounded p-2">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger class="block w-full text-start">
                                                <div class="flex flex-col space-y-1">
                                                    <span
                                                        v-for="(zip, zi) in parseJson(r.zip_codes).slice(0, 3)"
                                                        :key="zi"
                                                        :class="[cn('text-xs leading-snug', { 'text-success font-bold': isZipCodeHighlighted(zip) })]"
                                                    >{{ zip }}</span>
                                                    <span
                                                        v-if="parseJson(r.zip_codes).length > 3"
                                                        class="text-xs text-gray-500"
                                                    >...</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent class="text-sm max-w-50">
                                                <div class="flex flex-wrap gap-1">
                                                    <span
                                                        v-for="(zip, zi) in parseJson(r.zip_codes)"
                                                        :key="`tt-${zi}`"
                                                        :class="[cn('text-xs', { 'text-success font-bold': isZipCodeHighlighted(zip) })]"
                                                    >{{ zip }}{{ zi < parseJson(r.zip_codes).length - 1 ? ',' : '' }}</span>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableCell>

                            <TableCell class="text-xs flex flex-row items-center justify-end gap-2 bg-[#F1F2F7] overflow-x-hidden py-3 px-2">
                                <template v-if="type === 'me'">
                                    <ReplacementBoostButton
                                        v-if="canBoostReplacement(r, type) && !isActivelyBoosted(r)"
                                        variant="table"
                                        @boost="openBoostPreview(r)"
                                    />
                                    <ReplacementBoostStars
                                        v-else-if="isActivelyBoosted(r)"
                                        plain
                                        clickable
                                        @click="openBoostActive(r)"
                                    />
                                    <DropdownMenu>
                                        <DropdownMenuTrigger class="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-200/80 transition-colors">
                                            <Ellipsis class="h-5 w-5 text-gray-700" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent class="w-48">
                                            <DropdownMenuItem as-child>
                                                <NuxtLink
                                                    :href="`/dashboard/replacements/detail/${r.id}`"
                                                    class="flex items-center space-x-2 text-sm"
                                                >
                                                    <Eye class="h-4 w-4" />
                                                    <span>Voir</span>
                                                </NuxtLink>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                class="flex items-center space-x-2 text-sm"
                                                @click="emit('open-edit', r)"
                                            >
                                                <SquarePen class="h-4 w-4" />
                                                <span>Modifier</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                v-if="currentUserId === r.user_id && !hasConfirmedSubstitute(r)"
                                                class="flex items-center space-x-2 text-sm"
                                                @click="emit('select-replacement', r)"
                                            >
                                                <X class="h-4 w-4" />
                                                <span>Fermer</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </template>
                                <template v-else>
                                    <ReplacementBoostStars
                                        v-if="isActivelyBoosted(r)"
                                        size="sm"
                                    />
                                    <Button
                                        v-if="currentUserId === r.user_id && !hasConfirmedSubstitute(r)"
                                        class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white justify-center items-center"
                                        @click="openCloseDialog(r)"
                                    >
                                        <X class="h-6 mt-1" />
                                    </Button>
                                    <Button
                                        class="inline-block rounded bg-[#E4E7F4] text-black hover:text-white justify-center items-center"
                                        :href="`/dashboard/replacements/detail/${r.id}`"
                                    >
                                        <Eye class="h-6 mt-1" />
                                    </Button>
                                </template>
                            </TableCell>

                            <span class="bg-white h-[0.01em]" />
                        </TableRow>
                    </template>
                </TableBody>
            </Table>
        </div>

        <ReplacementBoostModal
            v-model:open="boostModalOpen"
            :replacement="boostModalReplacement"
            @cancelled="onBoostCancelled"
        />

        <Dialog v-model:open="closeReplacementDialog">
            <DialogContent class="sm:max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Fermer le remplacement</DialogTitle>
                    <DialogDescription class="mt-3 mb-6">
                        Etes-vous sur de vouloir fermer ce remplacement ?
                    </DialogDescription>
                </DialogHeader>
                <div class="mt-4 sm:mt-8 flex justify-center sm:justify-end space-x-6 items-center">
                    <Button
                        variant="secondary"
                        class="bg-gray-200 hover:bg-gray-300 px-8"
                        @click="closeReplacementDialog = false"
                    >
                        Non
                    </Button>
                    <Button
                        variant="default"
                        class="px-8"
                        @click="() => { emit('close-replacement', pendingCloseReplacement); closeReplacementDialog = false; }"
                    >
                        Oui
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script lang="ts" setup>
import { CircleCheck, Ellipsis, Eye, SquarePen, X } from 'lucide-vue-next';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/unified-signatures */
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ReplacementTableSkeleton from '@/components/replacements/ReplacementTableSkeleton.vue';
import ReplacementBoostButton from '@/components/replacements/ReplacementBoostButton.vue';
import ReplacementBoostStars from '@/components/replacements/ReplacementBoostStars.vue';
import ReplacementBoostModal from '@/components/replacements/ReplacementBoostModal.vue';
import { cn } from '@/lib/utils';
import { getPeriodsFromTimeSlot } from '~/lib/utils';
import { isReplacementActivelyBoosted } from '~/lib/replacementBoost';
import { useInstitutions } from '~/composables/useInstitution';
import type { Replacement } from '~/lib/types';

const { canBoostReplacement } = useReplacementBoost();

const boostModalOpen = ref(false);
const boostModalReplacement = ref<Replacement | null>(null);

const openBoostPreview = (r: Replacement) => {
    boostModalReplacement.value = r;
    boostModalOpen.value = true;
};

const openBoostActive = (r: Replacement) => {
    boostModalReplacement.value = r;
    boostModalOpen.value = true;
};

const onBoostCancelled = () => {
    if (boostModalReplacement.value) {
        boostModalReplacement.value.is_boosted = false;
        boostModalReplacement.value.boosted_until = null;
    }
};

const isActivelyBoosted = (replacement: Replacement) => isReplacementActivelyBoosted(replacement);

interface Props {
    replacements: Replacement[];
    loading?: boolean;
    type?: string;
    groupMembers?: any[];
    isSubmitted?: boolean;
    searchZipCodes?: string[];
    searchCities?: string[];
}

const props = withDefaults(defineProps<Props>(), {
    loading: false,
    type: '',
    groupMembers: () => [],
    isSubmitted: false,
    searchZipCodes: () => [],
    searchCities: () => [],
});

const user = useState<{ id: number }>('user');
const currentUserId = computed(() => Number(user.value?.id ?? 0));

const emit = defineEmits<{
    (e: 'show-periods', periods: any[]): void;
    (e: 'show-info-user', user: any): void;
    (e: 'open-edit', replacement: Replacement): void;
    (e: 'select-replacement', replacement: Replacement): void;
    (e: 'close-replacement', replacement: Replacement | null): void;
}>();

const closeReplacementDialog = ref(false);
const pendingCloseReplacement = ref<Replacement | null>(null);

const openCloseDialog = (r: Replacement) => {
    pendingCloseReplacement.value = r;
    closeReplacementDialog.value = true;
};

const gridColsByType: Record<string, string> = {
    'groups': 'grid-cols-8',
    'me': 'grid-cols-6',
    '': 'grid-cols-8',
};
const gridClass = computed(() => gridColsByType[props.type] ?? 'grid-cols-8');

const roles: Record<string, string> = {
    nurse: 'Infirmier(e)',
    caregiver: 'Aide soignant(e)',
    midwife: 'Sage-femme',
};

const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const parseJson = (value: any): any[] => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    try {
        return JSON.parse(value);
    }
    catch { return []; }
};

const normalizeTime = (t: string) => t?.split(':').slice(0, 2).join(':') ?? null;

const hasShift = (r: Replacement, period: string) => {
    const periods = new Set<string>();
    const raw = r.timeSlot;
    if (raw) {
        const ts = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (ts.start_at && ts.end_at) {
            getPeriodsFromTimeSlot(normalizeTime(ts.start_at), normalizeTime(ts.end_at)).forEach(p => periods.add(p));
        }
        else {
            Object.values(ts).forEach((v: any) => {
                if (v?.start_at && v?.end_at) {
                    getPeriodsFromTimeSlot(normalizeTime(v.start_at), normalizeTime(v.end_at)).forEach(p => periods.add(p));
                }
            });
        }
    }
    r.details?.forEach((d: any) => {
        if (d.start_at && d.end_at) {
            getPeriodsFromTimeSlot(normalizeTime(d.start_at), normalizeTime(d.end_at)).forEach(p => periods.add(p));
        }
    });
    return periods.has(period);
};

const isUrgentReplacement = (r: Replacement) => r.type === 'immediate' && r.details?.length > 0;
const hasConfirmedSubstitute = (r: Replacement) => r.has_confirmed_substitute === true;
const isClosed = (r: Replacement) => r.status === 'closed' || hasConfirmedSubstitute(r);

const getUniqueValues = (details: any[], extractor: (d: any) => any) =>
    [...new Set(details.flatMap(d => extractor(d) || []).filter(Boolean))];

const isZipCodeHighlighted = (zip: string) =>
    props.isSubmitted && props.searchZipCodes.includes(zip?.toString().trim());

const hasMatchingCity = (city: string) => {
    if (!props.isSubmitted) return false;
    const n = city.toLowerCase().trim();
    return props.searchCities.some(t => t.toLowerCase() === n || t.toLowerCase().includes(n));
};

const getCreatorInfo = (r: Replacement, field: 'name' | 'group') => {
    if (props.type !== 'groups') return '';
    const m = props.groupMembers.find(m => m.user_id === r.user_id);
    if (!m) return '';
    return field === 'name'
        ? `${m.firstname ?? ''} ${m.lastname ?? ''}`.trim()
        : m.group_name ?? '';
};

const { getLogoUrl } = useInstitutions();

const getInstitutionName = (r: Replacement): string => {
    if (r.institution) return r.institution.name;
    if (r.user?.institution) return r.user.institution.name;
    return '';
};

const getInstitutionLogoUrl = (r: Replacement): string | null => {
    const logo = r.institution?.logo || r.user?.institution?.logo;
    if (!logo) return null;
    return getLogoUrl(logo);
};

const isNew = (r: Replacement) => {
    const createdAt = (r as any).created_at;
    if (!createdAt) return false;
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(createdAt) > oneWeekAgo;
};
</script>
