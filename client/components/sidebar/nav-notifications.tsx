import { BellIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function NavNotifications() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="h-12 w-12 hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none">
          <BellIcon size={24} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-2">
        <Tabs>
          <TabsList className="w-full flex">
            <TabsTrigger value="all" className="w-1/3">All</TabsTrigger>
            <TabsTrigger value="unread" className="w-1/3">Unread</TabsTrigger>
            <TabsTrigger value="read" className="w-1/3">Read</TabsTrigger>
          </TabsList>
          <TabsContent value="all">All notifications</TabsContent>
          <TabsContent value="unread">Unread notifications</TabsContent>
          <TabsContent value="read">Read notifications</TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
