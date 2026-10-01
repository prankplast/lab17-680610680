import { z } from "zod";
import type { Course } from "@/lib/types";

export const createCourseFormSchema = (courses: Course[]) =>
  z.object({
    courseId: z
      .string()
      .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก")
      .refine(
        (code) => !courses.some((course) => String(course.courseId) === code),
        "รหัสวิชานี้มีอยู่แล้ว"
      ),

    courseTitle: z
      .string()
      .trim()
      .min(1, "กรุณากรอกชื่อวิชา")
      .max(100, "ชื่อวิชาต้องมีความยาวไม่เกิน 100 ตัวอักษร"),

    instructors: z
      .array(
        z.object({
          name: z.string().trim().min(1, "กรุณากรอกชื่อผู้สอน"),
          email: z
            .string()
            .trim()
            .email("รูปแบบอีเมลไม่ถูกต้อง")
            .refine(
              (email) => email.endsWith("@cmu.ac.th"),
              "ต้องเป็นอีเมล @cmu.ac.th"
            ),
        })
      )
      .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
      .max(3, "มีผู้สอนได้ไม่เกิน 3 คน")
      .refine(
        (instructors) => {
          const emails = instructors.map((instructor) =>
            instructor.email.trim().toLowerCase()
          );

          return new Set(emails).size === emails.length;
        },
        {
          message: "อีเมลผู้สอนซ้ำกัน",
        }
      ),

    program:  z.enum(["CPE", "ISNE"], {
      error: "เลือกหลักสูตร",
    }),

    semester: z.enum(["1", "2", "3"], {
      error: "เลือกภาคการศึกษา",
    }),

    description: z
      .string()
      .max(100, "รายละเอียดต้องมีความยาวไม่เกิน 100 ตัวอักษร"),

    notifyByEmail: z.boolean(),
  });

export type CourseFormValues = z.infer<
  ReturnType<typeof createCourseFormSchema>
>;