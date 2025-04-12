
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";

interface FocusTimeSettingsProps {
  onSave: (settings: {
    focusTime: number;
    breakTime: number;
    longBreakTime: number;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
  }) => void;
  currentSettings: {
    focusTime: number;
    breakTime: number;
    longBreakTime: number;
    longBreakInterval: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
  };
}

export function FocusTimeSettings({ 
  onSave, 
  currentSettings 
}: FocusTimeSettingsProps) {
  const [settings, setSettings] = useState(currentSettings);
  const [open, setOpen] = useState(false);
  
  const handleChange = (key: string, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleSave = () => {
    onSave(settings);
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Customize Focus Times
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Focus Time Settings</DialogTitle>
          <DialogDescription>
            Customize your focus and break durations to suit your workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Focus Time (minutes)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.focusTime]}
                min={5}
                max={60}
                step={5}
                onValueChange={(vals) => handleChange("focusTime", vals[0])}
                className="flex-1"
              />
              <span className="w-12 text-center font-mono">
                {settings.focusTime}
              </span>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Short Break (minutes)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.breakTime]}
                min={1}
                max={15}
                step={1}
                onValueChange={(vals) => handleChange("breakTime", vals[0])}
                className="flex-1"
              />
              <span className="w-12 text-center font-mono">
                {settings.breakTime}
              </span>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Long Break (minutes)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[settings.longBreakTime]}
                min={5}
                max={30}
                step={5}
                onValueChange={(vals) => handleChange("longBreakTime", vals[0])}
                className="flex-1"
              />
              <span className="w-12 text-center font-mono">
                {settings.longBreakTime}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <Label>Long Break After</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={settings.longBreakInterval}
              onChange={(e) => 
                handleChange("longBreakInterval", parseInt(e.target.value) || 4)
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Auto-start Breaks</Label>
            <Switch
              checked={settings.autoStartBreaks}
              onCheckedChange={(checked) => 
                handleChange("autoStartBreaks", checked)
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label>Auto-start Focus Sessions</Label>
            <Switch
              checked={settings.autoStartPomodoros}
              onCheckedChange={(checked) => 
                handleChange("autoStartPomodoros", checked)
              }
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} className="bg-[rgb(192,166,49)] hover:bg-[rgb(192,166,49)]/90">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
