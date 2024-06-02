import Checkbox from "@mui/material/Checkbox";

interface DefaultTableHeadProps {
    columns: {
        id: string;
        label: string;
        align?: "right";
    }[];
    selected: boolean;
    onSelectClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function DefaultTableRow({
    columns,
    selected,
    onSelectClick,
}: DefaultTableHeadProps) {
    return (
        <div
            className="h-[100px] min-w-max w-full"
            style={{
                borderBottom: "1px solid var(--foreground-low, #98A2B3)",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <div
                style={{
                    height: "100%",
                    aspectRatio: 1,
                    display: "grid",
                    placeItems: "center",
                }}
            >
                <Checkbox
                    // checked={selected}
                    defaultChecked={selected}
                    onChange={onSelectClick}
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
                        fontWeight: 400,
                        lineHeight: "normal",
                    }}
                >
                    {column.label}
                </div>
            ))}
        </div>
    );
}
