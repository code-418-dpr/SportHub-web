"use client";

import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import type { Category, Country, SportDiscipline, Team } from "@/app/generated/prisma";
import { EventsTable } from "@/components/home/events-table";
import { getCategories } from "@/data/category";
import { getCountries } from "@/data/country";
import { getUserEventIds } from "@/data/event";
import { getSportDisciplines } from "@/data/sportDiscipline";
import { getTeams } from "@/data/team";

export default function Home() {
    const { data: session } = useSession();
    const [countries, setCountries] = useState<Country[]>();
    const [categories, setCategories] = useState<Category[]>();
    const [sportDisciplines, setSportDisciplines] = useState<SportDiscipline[]>();
    const [teams, setTeams] = useState<Team[]>();
    const [userEventIds, setUserEventIds] = useState<bigint[] | null>();

    useEffect(() => {
        const fetchData = async () => {
            const countriesData = await getCountries();
            setCountries(countriesData);
            const categoriesData = await getCategories();
            setCategories(categoriesData);
            const sportDisciplinesData = await getSportDisciplines();
            setSportDisciplines(sportDisciplinesData);
            const teamsData = await getTeams();
            setTeams(teamsData);
            const userEventIdsData = session ? await getUserEventIds(session.user.id) : null;
            setUserEventIds(userEventIdsData);
        };
        void fetchData();
    }, [session]);

    return (
        <main className="flex-1 space-y-6">
            <div className="mx-auto max-w-[1800px] p-4">
                {countries !== undefined &&
                    categories !== undefined &&
                    sportDisciplines !== undefined &&
                    teams !== undefined &&
                    userEventIds !== undefined && (
                        <EventsTable
                            countries={countries}
                            categories={categories}
                            sportDisciplines={sportDisciplines}
                            teams={teams}
                            userEventIds={userEventIds}
                        />
                    )}
            </div>
        </main>
    );
}
