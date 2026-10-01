
import { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  createCourseFormSchema,
  type CourseFormValues,
} from "@/lib/schemas/course-schema";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { z } from "zod";

export function AddNewCourseDialog() {
  const addCourse = useEnrollmentStore((s) => s.addCourse);
  const courses = useEnrollmentStore((s) => s.courses);
  const [open, setOpen] = useState(false);

  const schema = createCourseFormSchema(courses);
  
  const defaultValues: CourseFormValues = {
      courseId: "",
      courseTitle: "",
      instructors: [
        {
          name: "",
          email: "",
        },
      ],
      program: "CPE",
      semester: "1",
      description: "",
      notifyByEmail: false,
    };

  const form = useForm<
    z.input<typeof schema>,
    unknown,
    z.output<typeof schema>
  >({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    //reset,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "instructors",
  });

  const handleFormSubmit = (values: CourseFormValues) => {
    addCourse({
      courseId: values.courseId.trim(),
      courseTitle: values.courseTitle.trim(),
      instructors: values.instructors,
      program: values.program,
      semester: values.semester,
      description: values.description.trim(),
      notifyByEmail: values.notifyByEmail,
    });

    form.reset();
    setOpen(false);
  };

  const handleDialogChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger render={<Button />}>
        <PlusCircle className="h-4 w-4" />
        เพิ่มวิชา
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="grid gap-5"
        >
          <DialogHeader>
            <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
            <DialogDescription>
              กรอกรหัสวิชา ชื่อวิชา ผู้สอน และรายละเอียดรายวิชา
            </DialogDescription>
          </DialogHeader>

          {/* รหัสวิชา */}
          <Controller
            name="courseId"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="courseId">
                  รหัสวิชา
                </FieldLabel>

                <Input
                  {...field}
                  id="courseId"
                  placeholder="เช่น 261305"
                  inputMode="numeric"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* ชื่อวิชา */}
          <Controller
            name="courseTitle"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="courseTitle">
                  ชื่อวิชา
                </FieldLabel>

                <Input
                  {...field}
                  id="courseTitle"
                  placeholder="เช่น Mobile Application Development"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* ผู้สอน */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-sm font-medium">
                  ผู้สอน
                </h3>

                <p className="text-sm text-muted-foreground">
                  {fields.length}/3 คน
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={fields.length >= 3}
                onClick={() =>
                  append({
                    name: "",
                    email: "",
                  })
                }
              >
                เพิ่มผู้สอน
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2"
                >
                  <div className="pt-2 text-sm font-medium">
                    {index + 1}.
                  </div>

                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    {/* ชื่อผู้สอน */}
                    <Controller
                      name={`instructors.${index}.name`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor={`instructor-${index}-name`}
                          >
                            ชื่อผู้สอน
                          </FieldLabel>

                          <Input
                            {...field}
                            id={`instructor-${index}-name`}
                            placeholder="กรอกชื่อผู้สอน"
                            aria-invalid={fieldState.invalid}
                          />

                          {fieldState.invalid && (
                            <FieldError
                              errors={[fieldState.error]}
                            />
                          )}
                        </Field>
                      )}
                    />

                    {/* อีเมล */}
                    <Controller
                      name={`instructors.${index}.email`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel
                            htmlFor={`instructor-${index}-email`}
                          >
                            อีเมล
                          </FieldLabel>

                          <Input
                            {...field}
                            id={`instructor-${index}-email`}
                            type="email"
                            placeholder="ต้องเป็นอีเมล @cmu.ac.th"
                            aria-invalid={fieldState.invalid}
                          />

                          {fieldState.invalid && (
                            <FieldError
                              errors={[fieldState.error]}
                            />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  {/* ลบผู้สอน */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-7"
                    disabled={fields.length <= 1}
                    onClick={() => remove(index)}
                    aria-label={`ลบผู้สอนคนที่ ${index + 1}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Array validation: อีเมลซ้ำ / จำนวนผู้สอน */}
            {errors.instructors?.root && (
              <p className="text-sm text-destructive">
                {errors.instructors.root.message}
              </p>
            )}
          </div>

          {/* หลักสูตร */}
          <Controller
            name="program"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>ชื่อหลักสูตร</FieldLabel>

                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="เลือกหลักสูตร" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="CPE">
                      CPE — วิศวกรรมคอมพิวเตอร์
                    </SelectItem>

                    <SelectItem value="ISNE">
                      ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย
                    </SelectItem>
                  </SelectContent>
                </Select>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* ภาคการศึกษา */}
          <Controller
            name="semester"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>ภาคการศึกษา</FieldLabel>

                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  className="gap-3"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="1"
                      id="semester-1"
                    />
                    <Label htmlFor="semester-1">
                      ภาคการศึกษาที่ 1
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="2"
                      id="semester-2"
                    />
                    <Label htmlFor="semester-2">
                      ภาคการศึกษาที่ 2
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem
                      value="3"
                      id="semester-summer"
                    />
                    <Label htmlFor="semester-summer">
                      ภาคฤดูร้อน
                    </Label>
                  </div>
                </RadioGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* รายละเอียด */}
          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => {
              const length = field.value?.length ?? 0;

              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">
                    รายละเอียด
                  </FieldLabel>

                  <Textarea
                    {...field}
                    id="description"
                    placeholder="รายละเอียดเพิ่มเติม"
                    aria-invalid={fieldState.invalid}
                  />

                  <p
                    className={
                      length > 100
                        ? "text-right text-sm text-destructive"
                        : "text-right text-sm text-muted-foreground"
                    }
                  >
                    {length}/100 ตัวอักษร
                  </p>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              );
            }}
          />

          {/* รับข่าวสารทางอีเมล */}
          <Controller
            name="notifyByEmail"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor="notifyByEmail">
                    รับข่าวสารทางอีเมล
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    แจ้งเตือนผู้สอนเมื่อเปิดลงทะเบียน
                  </p>
                </div>

                <Switch
                  id="notifyByEmail"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
            >
              <RotateCcw className="h-4 w-4" />
              ล้างฟอร์ม
            </Button>

            <Button type="submit">
              บันทึก
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
