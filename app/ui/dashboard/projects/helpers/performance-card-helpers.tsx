import * as React from "react";
import { HoverCard } from "radix-ui";

interface HoverCardDemoProps {
	children: React.ReactNode;
	icon: React.ElementType;
	message: { title: string; content: string };
}

const HoverCardDemo: React.FC<HoverCardDemoProps> = ({ children, icon: Icon, message }) => (
	<HoverCard.Root>
		<HoverCard.Trigger asChild>
			{children}
		</HoverCard.Trigger>
		<HoverCard.Portal>
			<HoverCard.Content
				className="w-[300px] rounded-md bg-white p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
				sideOffset={5}
			>
				<div className="flex flex-col gap-[7px]">
                    <Icon
                        width="32"
                        height="32"
                        style={{ marginLeft: -2 }}
                    />
					<div className="flex flex-col gap-[15px]">
						<div>
							<div className="m-0 text-[15px] font-medium text-mauve12">
								{message.title}
							</div>
						</div>
						<div className="m-0 text-[15px] text-mauve12">
							{message.content}
						</div>
					</div>
				</div>

				<HoverCard.Arrow className="fill-white" />
			</HoverCard.Content>
		</HoverCard.Portal>
	</HoverCard.Root>
);

export default HoverCardDemo;
