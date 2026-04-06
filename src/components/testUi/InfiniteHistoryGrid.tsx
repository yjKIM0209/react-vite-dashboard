import React, { useMemo, useRef, useState, useCallback } from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { HistoryData } from "@/types";

const fetchHistoryData = async (start: number, size: number): Promise<{ data: HistoryData[], totalCount: number }> => {
  await new Promise(resolve => setTimeout(resolve, 500)); 
  
  const mockData: HistoryData[] = Array.from({ length: size }).map((_, i) => ({
    no: start + i + 1,
    status: (start + i) % 5 === 0 ? "점검" : "정상",
    process: "무한스크롤 공정",
    factory: "창원공장",
    area: "Virtual-Line",
    eqpId: `EQP-${start + i + 1000}`,
    eqpName: `무한설비-${start + i + 1000}`,
    startTime: "2026-03-06 10:00",
    endTime: "2026-03-06 11:00",
    repairCost: 1000,
    duration: "01:00",
    memo: "Virtual Scroll Test",
  }));

  return { data: mockData, totalCount: 1000 };
}

export default function InfiniteHistoryGrid() {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ['history-infinite', sorting],
    queryFn: async ({ pageParam = 0 }) => {
      return fetchHistoryData((pageParam as number) * 50, 50);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const fetchedCount = allPages.length * 50;
      return fetchedCount < lastPage.totalCount ? allPages.length : undefined;
    },
    placeholderData: keepPreviousData,
  })

  const flatData = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data])
  const totalCount = data?.pages[0]?.totalCount ?? 0

  const columns = useMemo<ColumnDef<HistoryData>[]>(() => [
    { accessorKey: 'no', header: 'No.', size: 80 },
    { 
      accessorKey: 'status', 
      header: '상태', 
      size: 100,
      cell: (info) => (
        <span className={`${info.getValue() === '정상' ? 'text-green-600' : 'text-red-600'} font-bold`}>
          {info.getValue() as string}
        </span>
      )
    },
    { accessorKey: 'eqpId', header: '설비 ID', size: 150 },
    { accessorKey: 'eqpName', header: '설비명', size: 200 },
    { accessorKey: 'process', header: '공정', size: 120 },
    { accessorKey: 'repairCost', header: '비용', size: 120 },
  ], [])

  const table = useReactTable({
    data: flatData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  })

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 45,
    getScrollElement: () => tableContainerRef.current,
    overscan: 10,
  })

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop - clientHeight < 300 && !isFetching && flatData.length < totalCount) {
      fetchNextPage()
    }
  }, [fetchNextPage, isFetching, flatData.length, totalCount])

  if (isLoading) return <div className="p-10 text-center">데이터 로딩 중...</div>

  return (
    <div className="flex flex-col h-[800px] w-full bg-white rounded-lg shadow-inner p-4">
      <div className="mb-2 text-sm text-slate-500 font-semibold">
        Total: {totalCount} rows (Fetched: {flatData.length})
      </div>

      <div
        ref={tableContainerRef}
        onScroll={onScroll}
        className="flex-1 border border-slate-200 overflow-auto relative rounded-md"
      >
        <table className="w-full border-collapse" style={{ display: 'grid' }}>
          <thead className="sticky top-0 z-20 bg-slate-100 shadow-sm" style={{ display: 'grid' }}>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="p-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200"
                    style={{ width: header.getSize(), display: 'flex', alignItems: 'center' }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody
            className="relative"
            style={{
              display: 'grid',
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map(virtualRow => {
              const row = rows[virtualRow.index]
              return (
                <tr
                  key={row.id}
                  className="absolute w-full flex border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="p-3 text-sm text-slate-600 flex items-center"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
        {isFetching && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-4 py-2 rounded-full shadow-md border border-slate-200 text-xs font-bold text-emerald-600 animate-bounce">
            추가 데이터 불러오는 중...
          </div>
        )}
      </div>
    </div>
  )
}