UPDATE coach2."Routine_Repeat"
SET "lastIterationDateTime" = null
WHERE coach2."Routine_Repeat"."id" = 9;

UPDATE coach2."Todo_Repeat"
SET "lastIterationDateTime" = null
WHERE coach2."Todo_Repeat"."id" = 123;

DELETE FROM coach2."Iteration"
WHERE coach2."Iteration"."createdAt" > '2022-03-22 00:00:00.000-4';

DELETE FROM coach2."Event"
WHERE coach2."Event"."createdAt" > '2022-03-22 00:00:00.000-4'