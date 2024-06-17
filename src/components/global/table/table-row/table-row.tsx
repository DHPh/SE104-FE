/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Checkbox from "@mui/material/Checkbox";

interface DefaultTableRowProps {
    columns: {
        id: string;
        value: string;
    }[];
    selected: boolean;
    onSelectClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onItemClicked: () => void;
}

export default function DefaultTableRow({
    columns,
    selected,
    onSelectClick,
    onItemClicked,
}: DefaultTableRowProps) {
    return (
        <div
            className="h-[100px] min-w-max w-full hover:bg-slate-100 cursor-pointer pr-6"
            style={{
                borderBottom: "1px solid var(--foreground-low, #98A2B3)",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
            onClick={onItemClicked}
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
                    checked={selected}
                    // defaultChecked={selected}
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
                    {column.value}
                </div>
            ))}
        </div>
    );
}
