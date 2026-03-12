<template>
    <Table>
        <TableHeader class="w-full">
            <TableRow :class="['overflow-x-hidden gap-2 grid rounded-t-lg border-none', gridClass]">
                <TableHead
                    v-if="type === ''"
                    class="bg-primary w-full flex justify-center items-center text-white text-xs"
                >
                    Nom complet
                </TableHead>
                <TableHead
                    v-if="type === ''"
                    class="bg-primary w-full flex justify-center items-center text-white text-xs"
                >
                    Téléphone
                </TableHead>
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
    </Table>
</template>