import { EventsTable } from "@/components/home/events-table";
import { getCategories } from "@/data/category";
import { getCountries } from "@/data/country";
import { getUserEventIds } from "@/data/event";
import { getSportDisciplines } from "@/data/sportDiscipline";
import { getTeams } from "@/data/team";
import { auth } from "@/security/auth";

export default async function Home() {
    const countries = await getCountries();
    const categories = await getCategories();
    const sportDisciplines = await getSportDisciplines();
    const teams = await getTeams();

    const session = await auth();
    const userEventIds = session ? await getUserEventIds(session.user.id!) : null;

    return (
        <main className="flex-1 space-y-6">
            <div className="mx-auto max-w-[1800px] p-4">
                <EventsTable
                    countries={countries}
                    categories={categories}
                    sportDisciplines={sportDisciplines}
                    teams={teams}
                    userEventIds={userEventIds}
                />
            </div>
        </main>
    );
}
