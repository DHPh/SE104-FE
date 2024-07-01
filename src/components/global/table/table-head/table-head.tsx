import Checkbox from "@mui/material/Checkbox";

interface DefaultTableHeadProps {
    columns: {
        id?: string;
        label: string | number | JSX.Element | JSX.Element[] | null | undefined;
        align?: "right";
    }[];
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    numSelected: number;
    rowCount: number;
    useCheckbox?: boolean;
}

export default function DefaultTableHead({
    columns,
    onSelectAllClick,
    numSelected,
    rowCount,
    useCheckbox = true,
}: DefaultTableHeadProps) {
    return (
        <div
            className="h-[100px] min-w-max w-full px-6"
            style={{
                borderTop: "1px solid var(--foreground-low, #98A2B3)",
                borderBottom: "1px solid var(--foreground-low, #98A2B3)",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <div
                style={
                    useCheckbox
                        ? {
                              height: "100%",
                              aspectRatio: 1,
                              display: "grid",
                              placeItems: "center",
                          }
                        : { display: "none" }
                }
            >
                <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{ "aria-label": "select all desserts" }}
                />
            </div>
            {columns.map((column) => (
                <div
                    key={column.id}
                    style={{
                        minWidth: "199px",
                        display: "flex",
                        alignItems: "center",
                        color: "#000",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 900,
                        lineHeight: "normal",
                    }}
                >
                    {column.label}
                </div>
            ))}
        </div>
    );
}
