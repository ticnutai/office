import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Eye, MousePointer, Move, Palette, Type } from "lucide-react";

interface ElementStyle {
  backgroundColor?: string;
  background?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  position?: string;
  top?: string;
  left?: string;
  width?: string;
  height?: string;
  transform?: string;
}

interface SelectedElement {
  element: HTMLElement;
  originalStyles: ElementStyle;
  rect: DOMRect;
}

interface MultiSelectedElement {
  elements: HTMLElement[];
  originalStyles: ElementStyle[];
}

export function ElementInspector() {
  const [isActive, setIsActive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [multiSelected, setMultiSelected] = useState<HTMLElement[]>([]);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [editedStyles, setEditedStyles] = useState<ElementStyle>({});
  const [editedText, setEditedText] = useState("");
  const [panelPosition, setPanelPosition] = useState({ x: 16, y: 16 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const selectedOverlayRef = useRef<HTMLDivElement>(null);
  const multiOverlayRefs = useRef<HTMLDivElement[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  // Handle panel dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPanelPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (!isActive) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (selectedElement) return;
      
      const target = e.target as HTMLElement;
      if (target.closest('.element-inspector-panel') || target.closest('.inspector-overlay')) return;
      
      setHoveredElement(target);
      updateOverlay(target);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.element-inspector-panel') || target.closest('.inspector-overlay')) return;
      
      // Check if Ctrl key is pressed - allow original functionality
      if (e.ctrlKey) {
        return; // Let the original click handler work
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      const rect = target.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(target);
      
      const originalStyles: ElementStyle = {
        backgroundColor: computedStyle.backgroundColor,
        background: computedStyle.background,
        color: computedStyle.color,
        fontSize: computedStyle.fontSize,
        fontWeight: computedStyle.fontWeight,
        padding: computedStyle.padding,
        margin: computedStyle.margin,
        borderRadius: computedStyle.borderRadius,
        position: computedStyle.position,
        top: computedStyle.top,
        left: computedStyle.left,
        width: computedStyle.width,
        height: computedStyle.height,
        transform: computedStyle.transform,
      };

      // Check if Shift key is pressed for multi-selection
      if (e.shiftKey) {
        if (!multiSelected.includes(target)) {
          setMultiSelected(prev => [...prev, target]);
          addMultiSelectedOverlay(target);
        }
        return;
      }

      // Clear multi-selection when selecting single element
      setMultiSelected([]);
      clearMultiSelectedOverlays();
      
      setSelectedElement({ element: target, originalStyles, rect });
      setEditedStyles({});
      setEditedText(target.textContent || "");
      setHoveredElement(null);
      
      // Add selected overlay
      setTimeout(() => updateSelectedOverlay(target), 0);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true); // Use capture phase

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isActive, selectedElement]);

  const updateOverlay = (element: HTMLElement) => {
    if (!overlayRef.current) return;
    
    const rect = element.getBoundingClientRect();
    const overlay = overlayRef.current;
    
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.display = 'block';
  };

  const updateSelectedOverlay = (element: HTMLElement) => {
    if (!selectedOverlayRef.current) return;
    
    const rect = element.getBoundingClientRect();
    const overlay = selectedOverlayRef.current;
    
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.display = 'block';
  };

  const addMultiSelectedOverlay = (element: HTMLElement) => {
    const overlay = document.createElement('div');
    overlay.className = 'inspector-overlay fixed pointer-events-none border-2 border-purple-500 bg-purple-500/20 z-40';
    
    const rect = element.getBoundingClientRect();
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    
    const label = document.createElement('div');
    label.className = 'absolute -top-6 left-0 bg-purple-500 text-white text-xs px-2 py-1 rounded';
    label.textContent = `מרובה: ${element.tagName.toLowerCase()}`;
    overlay.appendChild(label);
    
    document.body.appendChild(overlay);
    multiOverlayRefs.current.push(overlay);
  };

  const clearMultiSelectedOverlays = () => {
    multiOverlayRefs.current.forEach(overlay => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    });
    multiOverlayRefs.current = [];
  };

  const applyStyle = (property: keyof ElementStyle, value: string) => {
    // Apply to selected element
    if (selectedElement) {
      selectedElement.element.style[property as any] = value;
      setEditedStyles(prev => ({ ...prev, [property]: value }));
    }
    
    // Apply to multi-selected elements
    if (multiSelected.length > 0) {
      multiSelected.forEach(element => {
        element.style[property as any] = value;
      });
    }
  };

  const applyText = (text: string) => {
    if (selectedElement) {
      selectedElement.element.textContent = text;
      setEditedText(text);
    }
    
    // Apply to multi-selected elements
    if (multiSelected.length > 0) {
      multiSelected.forEach(element => {
        element.textContent = text;
      });
    }
  };

  const resetElement = () => {
    if (!selectedElement) return;
    
    const { element, originalStyles } = selectedElement;
    Object.entries(originalStyles).forEach(([key, value]) => {
      if (value) {
        (element.style as any)[key] = value;
      }
    });
    
    setEditedStyles({});
  };

  const moveElement = (direction: string, amount: number = 10) => {
    if (!selectedElement) return;
    
    const element = selectedElement.element;
    const currentTransform = element.style.transform || '';
    
    let translateX = 0;
    let translateY = 0;
    
    const match = currentTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
    if (match) {
      translateX = parseInt(match[1]) || 0;
      translateY = parseInt(match[2]) || 0;
    }
    
    switch (direction) {
      case 'up':
        translateY -= amount;
        break;
      case 'down':
        translateY += amount;
        break;
      case 'left':
        translateX -= amount;
        break;
      case 'right':
        translateX += amount;
        break;
    }
    
    const newTransform = currentTransform.replace(/translate\([^)]+\)/, '') + 
                        ` translate(${translateX}px, ${translateY}px)`;
    
    applyStyle('transform', newTransform.trim());
  };

  const gradientOptions = [
    { name: "ירוק", value: "linear-gradient(135deg, #10b981, #059669)" },
    { name: "כתום", value: "linear-gradient(135deg, #f97316, #ea580c)" },
    { name: "כחול", value: "linear-gradient(135deg, #3b82f6, #2563eb)" },
    { name: "תכלת", value: "linear-gradient(135deg, #06b6d4, #0891b2)" },
    { name: "ורוד", value: "linear-gradient(135deg, #ec4899, #db2777)" },
    { name: "סגול", value: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
    { name: "גרדיאנט דוח", value: "linear-gradient(135deg, #10b981, #3b82f6)" },
    { name: "גרדיאנט אקסל", value: "linear-gradient(135deg, #f97316, #10b981)" },
  ];

  if (!isActive) {
    return (
      <Button
        onClick={() => setIsActive(true)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl border-2 border-white/20 backdrop-blur-sm"
        size="lg"
      >
        <Eye className="h-5 w-5 ml-2" />
        🎨 Element Editor
      </Button>
    );
  }

  return (
    <>
      {/* Hover overlay */}
      {hoveredElement && !selectedElement && (
        <div
          ref={overlayRef}
          className="inspector-overlay fixed pointer-events-none border-2 border-blue-500 bg-blue-500/10 z-40 transition-all"
          style={{ display: 'none' }}
        >
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded">
            {hoveredElement.tagName.toLowerCase()}
          </div>
        </div>
      )}

      {/* Selected element overlay */}
      {selectedElement && (
        <div
          ref={selectedOverlayRef}
          className="inspector-overlay fixed pointer-events-none border-2 border-green-500 bg-green-500/20 z-40"
          style={{ display: 'none' }}
        >
          <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded">
            נבחר: {selectedElement.element.tagName.toLowerCase()}
          </div>
        </div>
      )}

      <div 
        ref={panelRef}
        className={`element-inspector-panel fixed w-80 bg-gradient-to-br from-slate-50 via-white to-blue-50 shadow-2xl rounded-2xl border-2 border-white/60 backdrop-blur-md z-50 max-h-[calc(100vh-2rem)] overflow-auto select-none transition-shadow duration-200 ${
          isDragging ? 'shadow-4xl ring-4 ring-blue-400/50' : ''
        }`}
        style={{ 
          left: `${panelPosition.x}px`, 
          top: `${panelPosition.y}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: isDragging ? 'scale(1.02)' : 'scale(1)',
          transition: isDragging ? 'none' : 'transform 0.2s ease'
        }}
        dir="rtl"
      >
        <CardHeader 
          className="pb-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-2xl cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center pointer-events-none">
              🎨 עורך אלמנטים מתקדם
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 pointer-events-auto"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => {
                setIsActive(false);
                setSelectedElement(null);
                setMultiSelected([]);
                clearMultiSelectedOverlays();
                setHoveredElement(null);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-indigo-100 mt-1 flex items-center justify-between">
            <span>עריכה בזמן אמת עם בקרות מתקדמות</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">🔄 ניתן לגרירה</span>
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Multi-selection info */}
          {multiSelected.length > 0 && (
            <div className="mb-4 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl border-2 border-purple-300 shadow-lg">
              <h3 className="font-bold text-sm mb-1 flex items-center">
                ✨ נבחרו {multiSelected.length} אלמנטים
              </h3>
              <p className="text-xs text-purple-100 mb-3">
                שינויים יחולו על כל האלמנטים הנבחרים בו זמנית
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-1 text-xs bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={() => {
                  setMultiSelected([]);
                  clearMultiSelectedOverlays();
                }}
              >
                🗑️ נקה בחירה מרובה
              </Button>
            </div>
          )}

          {!selectedElement && multiSelected.length === 0 ? (
            <div className="text-center py-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-2 border-blue-200">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MousePointer className="h-8 w-8" />
              </div>
              <p className="text-lg font-bold text-blue-700 mb-3">🎯 ברוכים הבאים לעורך</p>
              <div className="text-sm text-blue-600 space-y-2 bg-white/60 p-4 rounded-lg mx-2">
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-4 h-4 bg-blue-500 rounded border-2"></span>
                  <p>ריחוף עם עכבר - מסגרת כחולה</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-4 h-4 bg-green-500 rounded border-2"></span>
                  <p>לחיצה רגילה - עריכת אלמנט</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <kbd className="px-2 py-1 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded text-xs">Ctrl</kbd>
                  <p>+ לחיצה - פונקציה מקורית</p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="w-4 h-4 bg-purple-500 rounded border-2"></span>
                  <kbd className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded text-xs">Shift</kbd>
                  <p>+ לחיצה - בחירה מרובה</p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Element Info */}
              <div className="mb-4 p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg border-2 border-green-300">
                <h3 className="font-bold text-sm mb-1 flex items-center">
                  🎯 אלמנט נבחר
                </h3>
                <p className="text-xs text-green-100 bg-white/20 px-2 py-1 rounded inline-block">
                  {selectedElement?.element.tagName.toLowerCase()}
                </p>
                {selectedElement?.element.className && (
                  <p className="text-xs text-green-100 mt-2">
                    קלאסים: {selectedElement.element.className}
                  </p>
                )}
              </div>

              <Tabs defaultValue="style" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-slate-200 to-slate-300 p-1 rounded-xl">
                  <TabsTrigger 
                    value="style"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white rounded-lg transition-all"
                  >
                    <Palette className="h-4 w-4 ml-1" />
                    🎨 עיצוב
                  </TabsTrigger>
                  <TabsTrigger 
                    value="text"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg transition-all"
                  >
                    <Type className="h-4 w-4 ml-1" />
                    ✏️ טקסט
                  </TabsTrigger>
                  <TabsTrigger 
                    value="position"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg transition-all"
                  >
                    <Move className="h-4 w-4 ml-1" />
                    📐 מיקום
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="style" className="space-y-4">
                  {/* Colors Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium border-b pb-1">צבעים ורקע</h4>
                    
                    <div>
                      <Label className="text-xs">גרדיאנט רקע</Label>
                      <Select onValueChange={(value) => applyStyle('background', value)}>
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="בחר גרדיאנט" />
                        </SelectTrigger>
                        <SelectContent>
                          {gradientOptions.map((option) => (
                            <SelectItem key={option.name} value={option.value}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">צבע רקע</Label>
                        <Input
                          type="color"
                          className="h-8 w-full"
                          value={editedStyles.backgroundColor || "#ffffff"}
                          onChange={(e) => applyStyle('backgroundColor', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">צבע טקסט</Label>
                        <Input
                          type="color"
                          className="h-8 w-full"
                          value={editedStyles.color || "#000000"}
                          onChange={(e) => applyStyle('color', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Typography Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium border-b pb-1">טיפוגרפיה</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">גודל גופן</Label>
                        <Input
                          type="number"
                          placeholder="16"
                          className="h-8"
                          onChange={(e) => applyStyle('fontSize', `${e.target.value}px`)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">עובי גופן</Label>
                        <Select onValueChange={(value) => applyStyle('fontWeight', value)}>
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="עובי" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">רגיל</SelectItem>
                            <SelectItem value="bold">מודגש</SelectItem>
                            <SelectItem value="600">חצי מודגש</SelectItem>
                            <SelectItem value="300">דק</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Layout Section */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium border-b pb-1">עיצוב ומבנה</h4>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">רדיוס פינות</Label>
                        <Input
                          type="number"
                          placeholder="8"
                          className="h-8"
                          onChange={(e) => applyStyle('borderRadius', `${e.target.value}px`)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">ריפוד פנימי</Label>
                        <Input
                          type="text"
                          placeholder="10px"
                          className="h-8"
                          onChange={(e) => applyStyle('padding', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-4">
                  <div>
                    <Label>תוכן הטקסט</Label>
                    <Input
                      value={editedText}
                      onChange={(e) => {
                        setEditedText(e.target.value);
                        applyText(e.target.value);
                      }}
                      placeholder="הזן טקסט..."
                    />
                  </div>
                </TabsContent>

                <TabsContent value="position" className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium border-b pb-1">הזזת אלמנט</h4>
                    <div className="grid grid-cols-3 gap-1">
                      <div></div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => moveElement('up')}
                      >
                        ↑
                      </Button>
                      <div></div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => moveElement('left')}
                      >
                        ←
                      </Button>
                      <div className="text-center text-xs text-gray-500 flex items-center justify-center">הזז</div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => moveElement('right')}
                      >
                        →
                      </Button>
                      <div></div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => moveElement('down')}
                      >
                        ↓
                      </Button>
                      <div></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium border-b pb-1">גודל אלמנט</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">רוחב</Label>
                        <Input
                          type="text"
                          placeholder="auto"
                          className="h-8"
                          onChange={(e) => applyStyle('width', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">גובה</Label>
                        <Input
                          type="text"
                          placeholder="auto"
                          className="h-8"
                          onChange={(e) => applyStyle('height', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 pt-4 border-t-2 border-gradient-to-r from-indigo-200 to-purple-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetElement}
                  className="flex-1 text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 hover:from-yellow-600 hover:to-orange-600 shadow-lg"
                >
                  🔄 איפוס שינויים
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedElement(null);
                    setMultiSelected([]);
                    clearMultiSelectedOverlays();
                    if (selectedOverlayRef.current) {
                      selectedOverlayRef.current.style.display = 'none';
                    }
                  }}
                  className="flex-1 text-xs bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 hover:from-red-600 hover:to-pink-600 shadow-lg"
                >
                  ❌ בטל כל בחירה
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </>
  );
}