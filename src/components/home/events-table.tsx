"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getCitiesOfCountries } from "@/data/city";
import { getFilteredEventWithPagination } from "@/data/event";
import { ExtendedEvent } from "@/prisma/types";
import { Category, City, Country, SportDiscipline, Team } from "@prisma/client";
import { CaretDownIcon, CaretSortIcon, CaretUpIcon } from "@radix-ui/react-icons";
import { ColumnDef, SortingState, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { MultiCombobox } from "../shared/multi-combobox";
import { Label } from "../ui/label";
import { DatePicker } from "./date-picker";
import { EventDialog } from "./event-dialog";

export const columns: ColumnDef<ExtendedEvent>[] = [
    {
        accessorKey: "sport",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === "asc");
                }}
                className="font-inherit px-0 hover:bg-inherit"
            >
                <span>Вид спорта</span>
                {column.getIsSorted() === "desc" ? (
                    <CaretDownIcon className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "asc" ? (
                    <CaretUpIcon className="ml-2 h-4 w-4" />
                ) : (
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                )}
            </Button>
        ),
        cell: ({ row }) => <div className="lowercase first-letter:uppercase">{row.original.SportDiscipline?.name}</div>,
        size: 15,
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === "asc");
                }}
                className="font-inherit px-0 hover:bg-inherit"
            >
                <span>Наименование спортивного мероприятия</span>
                {column.getIsSorted() === "desc" ? (
                    <CaretDownIcon className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "asc" ? (
                    <CaretUpIcon className="ml-2 h-4 w-4" />
                ) : (
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                )}
            </Button>
        ),
        cell: ({ row }) => <div>{row.original.name}</div>,
        size: 35,
    },
    {
        accessorKey: "location",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === "asc");
                }}
                className="font-inherit px-0 hover:bg-inherit"
            >
                <span>Место проведения</span>
                {column.getIsSorted() === "desc" ? (
                    <CaretDownIcon className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "asc" ? (
                    <CaretUpIcon className="ml-2 h-4 w-4" />
                ) : (
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                )}
            </Button>
        ),
        cell: ({ row }) => (
            <div>
                <p>{row.original.city.country.name}</p>
                <p>{row.original.city.name}</p>
            </div>
        ),
        size: 20,
    },
    {
        accessorKey: "dates",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === "asc");
                }}
                className="font-inherit px-0 hover:bg-inherit"
            >
                <span>Даты проведения</span>
                {column.getIsSorted() === "desc" ? (
                    <CaretDownIcon className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "asc" ? (
                    <CaretUpIcon className="ml-2 h-4 w-4" />
                ) : (
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                )}
            </Button>
        ),
        cell: ({ row }) => (
            <div>
                {row.original.start.toLocaleDateString()} - {row.original.end.toLocaleDateString()}
            </div>
        ),
        size: 20,
    },
    {
        accessorKey: "participantsCount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => {
                    column.toggleSorting(column.getIsSorted() === "asc");
                }}
                className="font-inherit px-0 hover:bg-inherit"
            >
                <span>Количество участников</span>
                {column.getIsSorted() === "desc" ? (
                    <CaretDownIcon className="ml-2 h-4 w-4" />
                ) : column.getIsSorted() === "asc" ? (
                    <CaretUpIcon className="ml-2 h-4 w-4" />
                ) : (
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                )}
            </Button>
        ),
        cell: ({ row }) => {
            const count = row.original.participantCount;
            return <div className="text-right font-medium">{count}</div>;
        },
        size: 10,
    },
];

interface EventsTableProps {
    countries: Country[];
    categories: Category[];
    sportDisciplines: SportDiscipline[];
    teams: Team[];
    userEventIds: bigint[] | null;
}

export function EventsTable({ countries, categories, sportDisciplines, teams, userEventIds }: EventsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);

    const [nameFilter, setNameFilter] = useState<string>("");

    const [genderFilter, setGenderFilter] = useState<Map<string, boolean>>(
        new Map([
            ["Мужской", false],
            ["Женский", false],
        ]),
    );

    const [sportFilter, setSportFilter] = useState<Map<string, boolean>>(
        new Map(sportDisciplines.map((sportDiscipline) => [sportDiscipline.name, false] as [string, boolean])),
    );

    const [teamFilter, setTeamFilter] = useState<Map<string, boolean>>(
        new Map(teams.map((team) => [team.name, false] as [string, boolean])),
    );

    const [categoryFilter, setCategoryFilter] = useState<Map<string, boolean>>(
        new Map(categories.map((category) => [category.name, false] as [string, boolean])),
    );

    const [countryFilter, setCountryFilter] = useState<Map<string, boolean>>(
        new Map(countries.map((country) => [country.name, false] as [string, boolean])),
    );

    const [cities, setCities] = useState<City[]>([]);

    const [cityFilter, setCityFilter] = useState<Map<string, boolean>>(
        new Map(cities.map((city) => [city.name, false] as [string, boolean])),
    );

    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    const [eventDialogOpen, setEventDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<ExtendedEvent | null>(null);

    const [age, setAge] = useState<number | undefined>(undefined);

    const [events, setEvents] = useState<ExtendedEvent[]>([]);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [rowCount, setRowCount] = useState(0);

    const handleRowClick = (event: ExtendedEvent): void => {
        setSelectedEvent(event);
        setEventDialogOpen(true);
    };

    const table = useReactTable({
        data: events,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        onPaginationChange: setPagination,
        rowCount,
        manualSorting: true,
        state: {
            sorting,
            pagination,
        },
    });

    const rowsShownString = useMemo(() => {
        const startRow = rowCount !== 0 ? pagination.pageIndex * pagination.pageSize + 1 : 0;
        const endRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, rowCount);

        return `${startRow} - ${endRow} из ${rowCount}`;
    }, [pagination.pageIndex, pagination.pageSize, rowCount]);

    useEffect(() => {
        async function fetchCities(): Promise<void> {
            const selectedCountryIds = Array.from(countryFilter.entries())
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isSelected]) => isSelected)
                .map(([countryName]) => countries.find((c) => c.name === countryName)?.id)
                .filter((id): id is string => id !== undefined);

            if (selectedCountryIds.length > 0) {
                const citiesForCountries = await getCitiesOfCountries(selectedCountryIds);
                setCities(citiesForCountries);
                setCityFilter(new Map(citiesForCountries.map((city) => [city.name, false] as [string, boolean])));
            } else {
                setCities([]);
                setCityFilter(new Map());
            }
        }
        void fetchCities();
    }, [countries, countryFilter]);

    useEffect(() => {
        const fetchEvents = async (
            name: string,
            sportIds: string[],
            teamIds: string[],
            categoriesIds: string[],
            gender: { male: boolean; female: boolean },
            age: number | undefined,
            countryIds: string[],
            cityIds: string[],
            start: Date | undefined,
            end: Date | undefined,
            sortBy: string | undefined,
            sortDirection: "asc" | "desc" | undefined,
        ): Promise<void> => {
            const { events: eventsData, total: rowCount } = await getFilteredEventWithPagination({
                page: pagination.pageIndex,
                pageSize: pagination.pageSize,
                name,
                sportIds,
                teamIds,
                categoriesIds,
                gender,
                age,
                countryIds,
                cityIds,
                start,
                end,
                sortBy,
                sortDirection,
            });
            setEvents(eventsData);
            setRowCount(rowCount);
        };

        void fetchEvents(
            nameFilter,
            Array.from(sportFilter.entries())
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isSelected]) => isSelected)
                .map(([sportName]) => sportDisciplines.find((s) => s.name === sportName)?.id)
                .filter((id): id is string => id !== undefined),
            Array.from(teamFilter.entries())
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isSelected]) => isSelected)
                .map(([teamName]) => teams.find((t) => t.name === teamName)?.id)
                .filter((id): id is string => id !== undefined),
            Array.from(categoryFilter.entries())
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isSelected]) => isSelected)
                .map(([categoryName]) => categories.find((c) => c.name === categoryName)?.id)
                .filter((id): id is string => id !== undefined),
            {
                male: genderFilter.get("Мужской") ?? false,
                female: genderFilter.get("Женский") ?? false,
            },
            age,
            Array.from(countryFilter.entries())
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isSelected]) => isSelected)
                .map(([countryName]) => countries.find((c) => c.name === countryName)?.id)
                .filter((id): id is string => id !== undefined),
            Array.from(cityFilter.entries())
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isSelected]) => isSelected)
                .map(([cityName]) => cities.find((c) => c.name === cityName)?.id)
                .filter((id): id is string => id !== undefined),
            dateRange?.from,
            dateRange?.to,
            sorting[0]?.id,
            sorting[0]?.desc ? "desc" : "asc",
        );
    }, [
        nameFilter,
        sportDisciplines,
        sportFilter,
        teams,
        teamFilter,
        categories,
        categoryFilter,
        genderFilter,
        age,
        countryFilter,
        countries,
        cityFilter,
        cities,
        dateRange,
        pagination,
        sorting,
    ]);

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 gap-x-16 gap-y-4 py-4 2xl:grid-cols-3">
                <Input
                    placeholder="Поиск по названию"
                    value={nameFilter}
                    onChange={(event) => {
                        setNameFilter(event.target.value);
                    }}
                    className="bg-background w-full"
                />
                <div className="flex flex-wrap items-center gap-4">
                    <MultiCombobox title="Вид спорта" values={sportFilter} setValues={setSportFilter} />
                    <MultiCombobox title="Состав" values={teamFilter} setValues={setTeamFilter} />
                    <MultiCombobox
                        title="Категория"
                        values={categoryFilter}
                        setValues={setCategoryFilter}
                        className="w-[400px]"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <MultiCombobox title="Пол" values={genderFilter} setValues={setGenderFilter} hideSearch={true} />
                    <div className="flex items-center gap-2">
                        <Label>Возраст:</Label>
                        <Input
                            className="bg-background w-12"
                            type="number"
                            min={0}
                            max={100}
                            value={age}
                            onChange={(event) => {
                                const value = event.target.value;
                                if (value === "") {
                                    setAge(undefined);
                                } else {
                                    setAge(Math.min(100, Math.max(0, Number(value))));
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <MultiCombobox title="Страна" values={countryFilter} setValues={setCountryFilter} />
                    {cities.length > 0 && <MultiCombobox title="Город" values={cityFilter} setValues={setCityFilter} />}
                </div>
                <DatePicker dateRange={dateRange} setDateRange={setDateRange} className="w-full" />
            </div>
            <div className="bg-background overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`py-4 ${
                                                header.column.id !== "title" ? "hidden md:table-cell" : ""
                                            }`}
                                            style={{ width: `${header.getSize()}%` }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => {
                                        handleRowClick(row.original);
                                    }}
                                    className="cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`py-4 ${
                                                cell.column.id !== "title" ? "hidden md:table-cell" : ""
                                            }`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    Ничего не найдено
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">{rowsShownString}</div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            table.previousPage();
                        }}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            table.nextPage();
                        }}
                        disabled={!table.getCanNextPage()}
                    >
                        <ChevronRight />
                    </Button>
                </div>
            </div>
            <EventDialog
                isOpen={eventDialogOpen}
                event={selectedEvent}
                setIsOpen={setEventDialogOpen}
                userEventIds={userEventIds}
            />
        </div>
    );
}
