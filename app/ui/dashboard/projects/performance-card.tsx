'use client';
import {
	// ArrowDownIcon,
	// ArrowUpIcon,
	// CheckIcon,
	// CopyIcon,
	// Cross2Icon,
	// DotsHorizontalIcon,
	DrawingPinFilledIcon,
	DrawingPinIcon,
	OpenInNewWindowIcon,
	// PlusIcon,
	// Share2Icon,
    MoveIcon,
    DoubleArrowDownIcon,
    ColorWheelIcon,
    EnterIcon
} from "@radix-ui/react-icons";
import {
	// Avatar,
	// Button,
	// Checkbox,
	// DropdownMenu,
	// Link,
	// Separator,
	// Strong,
	// Switch,
	// TextField,
	// Theme,
	Badge,
	Box,
	Card,
	Flex,
	Grid,
	Heading,
	IconButton,
	Text,
} from "@radix-ui/themes";
// import { Marker } from "@/app/tests/Marker";
// import { allPeople, email } from "@/lib/people";
import * as React from "react";
import HoverCardDemo from "./helpers/performance-card-helpers";


type LayoutProps = React.ComponentPropsWithoutRef<typeof Flex> & {
    focusable?: boolean;
    data: {totalImpact: number;
        totalInvestment: number;
        totalBankableInvestment: number;
        totalIncome: number;};
};

export default function PerformanceCard({ data, focusable, ...props }: LayoutProps) {
    const { totalImpact, totalInvestment, totalBankableInvestment, totalIncome } = data;
    // const [portalContainer, setPortalContainer] =
    //         React.useState<HTMLDivElement | null>(null);

        const tabIndex = focusable ? undefined : -1;

        // Simple state to make the example functional
        const [state, setState] = React.useState({
            todo: [
                { id: "a", completed: false },
                { id: "b", completed: false },
                { id: "c", completed: false },
                { id: "d", completed: false },
                { id: "e", completed: true },
                { id: "f", completed: true },
            ],
            activityPinned: true,
            financePinned: false,
        });

    const formatImpact = (value: number) => {
        return value >= 1_000_000
            ? `${(value / 1_000_000).toFixed(2)}M`
            : new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
    };

    const hoverMessages = {
        impact: {
            icon: MoveIcon,
            title: "Impact",
            content: "Impact in the context of carbon credit projects refers to the measurable positive effects that these projects have on reducing greenhouse gas emissions, enhancing biodiversity, and supporting sustainable development in local communities. These impacts are quantified and verified to ensure that the projects contribute to mitigating climate change and promoting environmental and social benefits."
        },
        investment: {
            icon: DoubleArrowDownIcon,
            title: "Investment",
            content: "Investment refers to the total amount of financial resources allocated to the carbon credit projects. This includes funds used for project development, implementation, and maintenance to ensure the successful generation of carbon credits."
        },
        bankable: {
            icon: ColorWheelIcon,
            title: "Bankable",
            content: "Bankable investment refers to the portion of the total investment that is expected to generate a return. This is the amount that can be financed through loans or other financial instruments, based on the projected income from the sale of carbon credits."
        },
        income: {
            icon: EnterIcon,
            title: "Income",
            content: "Income refers to the revenue generated from the sale of carbon credits. This income is used to cover project costs and provide returns to investors, ensuring the financial sustainability of the carbon credit projects."
        }
    };

    return (
        <Flex align="center" gap="6" {...props} width="100%">
            <Flex flexShrink="0" gap="6" direction="column" width="100%">
                <Card size="4" style={{ width: '100%' }}>
                    <Heading as="h3" size="6" trim="start" mb="2">
                        Main indicators
                    </Heading>

                    <Flex position="absolute" top="0" right="0" m="3">
                        <IconButton
                            tabIndex={tabIndex}
                            variant="ghost"
                            color="gray"
                            highContrast
                            style={{ margin: 0 }}
                        >
                            <OpenInNewWindowIcon width="20" height="20" />
                        </IconButton>

                        <IconButton
                            tabIndex={tabIndex}
                            variant={state.financePinned ? "soft" : "ghost"}
                            color="gray"
                            highContrast
                            style={{ margin: 0 }}
                            onClick={() =>
                                setState((state) => ({
                                    ...state,
                                    financePinned: !state.financePinned,
                                }))
                            }
                        >
                            {state.financePinned ? (
                                <DrawingPinFilledIcon width="20" height="20" />
                            ) : (
                                <DrawingPinIcon width="20" height="20" />
                            )}
                        </IconButton>
                    </Flex>

                    <Text as="p" size="2" mb="6" color="gray">
                        These are the most relevant indicators for the projects.
                    </Text>

                    <Grid columns={{ xs: "2", md: "4" }} gap="3">
                        <Box>
                            <Flex gap="1" mb="1" align="center">
                                <Text size={{ xs: '2', md: '1' }} color="gray">
                                    Impact
                                </Text>
                                <HoverCardDemo icon={hoverMessages.impact.icon} message={hoverMessages.impact}>
                                    <Badge color="amber" radius="full">
                                        <MoveIcon
                                            width="12"
                                            height="12"
                                            style={{ marginLeft: -2 }}
                                        />
                                    </Badge>
                                </HoverCardDemo>
                            </Flex>
                            <Text as="div" mb="1" size={{ xs: '7', md: '8' }} weight="bold">
                                {formatImpact(totalImpact)}
                            </Text>
                        </Box>

                        <Box>
                            <Flex gap="1" mb="1" align="center">
                                <Text size={{ xs: '2', md: '1' }} color="gray">
                                    Investment
                                </Text>
                                <HoverCardDemo icon={hoverMessages.investment.icon} message={hoverMessages.investment}>
                                    <Badge color="gold" radius="full">
                                        <DoubleArrowDownIcon
                                            width="12"
                                            height="12"
                                            style={{ marginLeft: -2 }}
                                        />
                                    </Badge>
                                </HoverCardDemo>
                            </Flex>
                            <Text as="div" mb="1" size={{ xs: '7', md: '8' }} weight="bold">
                            {formatImpact(totalInvestment)}
                            </Text>
                        </Box>

                        <Box>
                            <Flex gap="1" mb="1" align="center">
                                <Text size={{ xs: '2', md: '1' }} color="gray">
                                    Bankable
                                </Text>
                                <HoverCardDemo icon={hoverMessages.bankable.icon} message={hoverMessages.bankable}>
                                    <Badge color="tomato" radius="full">
                                        <ColorWheelIcon
                                            width="12"
                                            height="12"
                                            style={{ marginLeft: -2 }}
                                        />
                                    </Badge>
                                </HoverCardDemo>
                            </Flex>
                            <Text as="div" mb="1" size={{ xs: '7', md: '8' }} weight="bold">
                            {formatImpact(totalBankableInvestment)}
                            </Text>
                        </Box>

                        <Box>
                            <Flex gap="1" mb="1" align="center">
                                <Text size={{ xs: '2', md: '1' }} color="gray">
                                    Income
                                </Text>
                                <HoverCardDemo icon={hoverMessages.income.icon} message={hoverMessages.income}>
                                    <Badge color="plum" variant="surface" radius="full">
                                        <EnterIcon
                                            width="12"
                                            height="12"
                                            style={{ marginLeft: -2 }}
                                        />
                                    </Badge>
                                </HoverCardDemo>
                            </Flex>
                            <Text as="div" mb="1" size={{ xs: '7', md: '8' }} weight="bold">
                            {formatImpact(totalIncome)}
                            </Text>
                        </Box>
                    </Grid>
                </Card>
            </Flex>
        </Flex>
    );
}