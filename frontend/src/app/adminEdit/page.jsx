import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

export default function CreationPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center bg-cover bg-fixed bg-center bg-no-repeat px-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(11, 5, 29, 0.95), rgba(28, 17, 50, 0.95)), url('/bgpic.png')",
      }}
    >
      <div className="flex w-full flex-grow items-start justify-center pb-10 pt-14">
        <Card className="w-[350px] max-w-md items-center rounded-lg bg-opacity-40 shadow-lg backdrop-blur-md">
          <CardHeader>
            <CardTitle>Edit Tournament</CardTitle>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Tournament Name</Label>
                  <Input id="name" placeholder="" />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="remark">Remarks</Label>
                  <Input id="remark" placeholder="" />
                </div>
                <div>
                  <Label htmlFor="startTime">Tournament Start DateTime</Label>
                  <Input id="startTime" type="datetime-local" />
                </div>
                <div>
                  <Label htmlFor="endTime">Tournament End DateTime</Label>
                  <Input id="endTime" type="datetime-local" />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-2">
            <div className="flex w-full items-center justify-center space-x-2">
              <Link href="/adminHome">
                <Button
                  variant="outline"
                  className="bg-[#1e0b38] text-white hover:bg-gray-300/70"
                >
                  {' '}
                  Cancel
                </Button>
              </Link>
              <Button
                variant="outline"
                className="bg-white text-[#1e0b38] hover:bg-gray-300/70"
              >
                {' '}
                Edit
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
