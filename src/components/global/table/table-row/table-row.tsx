/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Checkbox from "@mui/material/Checkbox";

interface DefaultTableRowProps {
    columns: {
        id?: string;
        value: string | number | JSX.Element | JSX.Element[] | null | undefined;
    }[];
    selected: boolean;
    onSelectClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onItemClicked: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    useCheckbox?: boolean;
}

export default function DefaultTableRow({
    columns,
    selected,
    onSelectClick,
    onItemClicked,
    useCheckbox = true,
}: DefaultTableRowProps) {
    return (
        <div
            className="h-[100px] min-w-max w-full hover:bg-slate-100 cursor-pointer px-6"
            style={{
                position: "relative",
                borderBottom: "1px solid var(--foreground-low, #98A2B3)",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    right: 0,
                    top: 0,
                    bottom: 0,
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onItemClicked(e);
                }}
            />
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
                    checked={selected}
                    // defaultChecked={selected}
                    onChange={(e) => {
                        e.stopPropagation();
                        onSelectClick(e);
                    }}
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
