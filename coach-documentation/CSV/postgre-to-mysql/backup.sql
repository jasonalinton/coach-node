PGDMP     /                    z           coach    13.2    13.2    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16410    coach    DATABASE     P   CREATE DATABASE coach WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';
    DROP DATABASE coach;
                jasonalintonsql    false            
            2615    68182    coach2    SCHEMA        CREATE SCHEMA coach2;
    DROP SCHEMA coach2;
                jasonalintonsql    false            �           1259    185727    Blurb    TABLE     �   CREATE TABLE coach2."Blurb" (
    id integer NOT NULL,
    text text NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE coach2."Blurb";
       coach2         heap    jasonalintonsql    false    10            �           1259    185725    Blurb_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Blurb_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE coach2."Blurb_id_seq";
       coach2          jasonalintonsql    false    10    479            �           0    0    Blurb_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE coach2."Blurb_id_seq" OWNED BY coach2."Blurb".id;
          coach2          jasonalintonsql    false    478            @           1259    69539    Event    TABLE     
  CREATE TABLE coach2."Event" (
    id integer NOT NULL,
    text text NOT NULL,
    "isAllDay" boolean DEFAULT false NOT NULL,
    "isRecommended" boolean DEFAULT false NOT NULL,
    "isSynced" boolean DEFAULT false NOT NULL,
    "idGoogleEvent" integer,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endAt" timestamp(6) with time zone,
    "startAt" timestamp(6) with time zone,
    "idType" integer
);
    DROP TABLE coach2."Event";
       coach2         heap    jasonalintonsql    false    10            ?           1259    69537    Event_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Event_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE coach2."Event_id_seq";
       coach2          jasonalintonsql    false    320    10            �           0    0    Event_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE coach2."Event_id_seq" OWNED BY coach2."Event".id;
          coach2          jasonalintonsql    false    319                       1259    68926    Goal    TABLE     �  CREATE TABLE coach2."Goal" (
    id integer NOT NULL,
    text text NOT NULL,
    description text,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dateTimeDeleted" timestamp(6) with time zone,
    "idType" integer,
    "position" text
);
    DROP TABLE coach2."Goal";
       coach2         heap    jasonalintonsql    false    10            5           1259    69180    Goal_Repeat    TABLE     �  CREATE TABLE coach2."Goal_Repeat" (
    id integer NOT NULL,
    "idGoal" integer NOT NULL,
    "idRepeat" integer NOT NULL,
    "lastIterationDateTime" timestamp(6) with time zone,
    "isEventVisible" boolean NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isRecommended" boolean DEFAULT false NOT NULL
);
 !   DROP TABLE coach2."Goal_Repeat";
       coach2         heap    jasonalintonsql    false    10            4           1259    69178    Goal_Repeat_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Goal_Repeat_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE coach2."Goal_Repeat_id_seq";
       coach2          jasonalintonsql    false    10    309            �           0    0    Goal_Repeat_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE coach2."Goal_Repeat_id_seq" OWNED BY coach2."Goal_Repeat".id;
          coach2          jasonalintonsql    false    308            -           1259    69140    Goal_TimePair    TABLE     W  CREATE TABLE coach2."Goal_TimePair" (
    id integer NOT NULL,
    "idGoal" integer NOT NULL,
    "idTimeType" integer NOT NULL,
    "idStartTime" integer,
    "idEndTime" integer,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 #   DROP TABLE coach2."Goal_TimePair";
       coach2         heap    jasonalintonsql    false    10            ,           1259    69138    Goal_TimePair_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Goal_TimePair_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE coach2."Goal_TimePair_id_seq";
       coach2          jasonalintonsql    false    301    10            �           0    0    Goal_TimePair_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE coach2."Goal_TimePair_id_seq" OWNED BY coach2."Goal_TimePair".id;
          coach2          jasonalintonsql    false    300            �           1259    205148 	   Goal_Todo    TABLE     �   CREATE TABLE coach2."Goal_Todo" (
    id integer NOT NULL,
    "idGoal_Parent" integer NOT NULL,
    "idTodo_Child" integer NOT NULL,
    "todoPosition" integer NOT NULL
);
    DROP TABLE coach2."Goal_Todo";
       coach2         heap    jasonalintonsql    false    10            �           1259    205146    Goal_Todo_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Goal_Todo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE coach2."Goal_Todo_id_seq";
       coach2          jasonalintonsql    false    10    482            �           0    0    Goal_Todo_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE coach2."Goal_Todo_id_seq" OWNED BY coach2."Goal_Todo".id;
          coach2          jasonalintonsql    false    481                       1259    68924    Goal_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Goal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE coach2."Goal_id_seq";
       coach2          jasonalintonsql    false    280    10            �           0    0    Goal_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE coach2."Goal_id_seq" OWNED BY coach2."Goal".id;
          coach2          jasonalintonsql    false    279            >           1259    69525 	   Iteration    TABLE     �  CREATE TABLE coach2."Iteration" (
    id integer NOT NULL,
    text text NOT NULL,
    "isRecommended" boolean DEFAULT false NOT NULL,
    "idGoogleTask" integer,
    "idGoogleTaskList" integer,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "attemptedAt" timestamp(6) with time zone,
    "completedAt" timestamp(6) with time zone,
    "endAt" timestamp(6) with time zone,
    "startAt" timestamp(6) with time zone,
    "idRepeat" integer,
    "idRoutineIteration" integer,
    "idRoutineRepeat" integer,
    "idTodoRepeat" integer,
    "idRoutine" integer,
    "idTodo" integer,
    "idTodoTimePair" integer
);
    DROP TABLE coach2."Iteration";
       coach2         heap    jasonalintonsql    false    10            =           1259    69523    Iteration_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Iteration_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE coach2."Iteration_id_seq";
       coach2          jasonalintonsql    false    10    318            �           0    0    Iteration_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE coach2."Iteration_id_seq" OWNED BY coach2."Iteration".id;
          coach2          jasonalintonsql    false    317            $           1259    69058    Metric    TABLE       CREATE TABLE coach2."Metric" (
    id integer NOT NULL,
    text text NOT NULL,
    description text,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE coach2."Metric";
       coach2         heap    jasonalintonsql    false    10            #           1259    69056    Metric_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Metric_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE coach2."Metric_id_seq";
       coach2          jasonalintonsql    false    292    10            �           0    0    Metric_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE coach2."Metric_id_seq" OWNED BY coach2."Metric".id;
          coach2          jasonalintonsql    false    291            3           1259    69170    Repeat    TABLE     �  CREATE TABLE coach2."Repeat" (
    id integer NOT NULL,
    "idType" integer NOT NULL,
    "idTimeframe" integer NOT NULL,
    "idStartRepeat" integer,
    "idEndRepeat" integer,
    "idStartIteration" integer,
    "idEndIteration" integer,
    "interval" integer NOT NULL,
    frequency integer NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "idRoutineRepeat" integer
);
    DROP TABLE coach2."Repeat";
       coach2         heap    jasonalintonsql    false    10            ;           1259    69435    Repeat_DayIndex    TABLE        CREATE TABLE coach2."Repeat_DayIndex" (
    id integer NOT NULL,
    "idRepeat" integer NOT NULL,
    index integer NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 %   DROP TABLE coach2."Repeat_DayIndex";
       coach2         heap    jasonalintonsql    false    10            :           1259    69433    Repeat_DayIndex_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Repeat_DayIndex_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE coach2."Repeat_DayIndex_id_seq";
       coach2          jasonalintonsql    false    10    315            �           0    0    Repeat_DayIndex_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE coach2."Repeat_DayIndex_id_seq" OWNED BY coach2."Repeat_DayIndex".id;
          coach2          jasonalintonsql    false    314            2           1259    69168    Repeat_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Repeat_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE coach2."Repeat_id_seq";
       coach2          jasonalintonsql    false    10    307            �           0    0    Repeat_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE coach2."Repeat_id_seq" OWNED BY coach2."Repeat".id;
          coach2          jasonalintonsql    false    306                       1259    68954    Routine    TABLE     �  CREATE TABLE coach2."Routine" (
    id integer NOT NULL,
    text text NOT NULL,
    description text,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dateTimeDeleted" timestamp(6) with time zone,
    "position" text
);
    DROP TABLE coach2."Routine";
       coach2         heap    jasonalintonsql    false    10            w           1259    86702    RoutineTodo_Iteration    TABLE     �   CREATE TABLE coach2."RoutineTodo_Iteration" (
    id integer NOT NULL,
    "idRoutineIteration" integer NOT NULL,
    "hasTodoEvent" boolean DEFAULT false NOT NULL
);
 +   DROP TABLE coach2."RoutineTodo_Iteration";
       coach2         heap    jasonalintonsql    false    10            v           1259    86700    RoutineTodo_Iteration_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."RoutineTodo_Iteration_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 5   DROP SEQUENCE coach2."RoutineTodo_Iteration_id_seq";
       coach2          jasonalintonsql    false    375    10            �           0    0    RoutineTodo_Iteration_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE coach2."RoutineTodo_Iteration_id_seq" OWNED BY coach2."RoutineTodo_Iteration".id;
          coach2          jasonalintonsql    false    374            9           1259    69200    Routine_Repeat    TABLE     �  CREATE TABLE coach2."Routine_Repeat" (
    id integer NOT NULL,
    "idRoutine" integer NOT NULL,
    "idRepeat" integer NOT NULL,
    "lastIterationDateTime" timestamp(6) with time zone,
    "isEventVisible" boolean NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isRecommended" boolean DEFAULT false NOT NULL
);
 $   DROP TABLE coach2."Routine_Repeat";
       coach2         heap    jasonalintonsql    false    10            8           1259    69198    Routine_Repeat_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Routine_Repeat_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE coach2."Routine_Repeat_id_seq";
       coach2          jasonalintonsql    false    10    313            �           0    0    Routine_Repeat_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE coach2."Routine_Repeat_id_seq" OWNED BY coach2."Routine_Repeat".id;
          coach2          jasonalintonsql    false    312            1           1259    69160    Routine_TimePair    TABLE     ]  CREATE TABLE coach2."Routine_TimePair" (
    id integer NOT NULL,
    "idRoutine" integer NOT NULL,
    "idTimeType" integer NOT NULL,
    "idStartTime" integer,
    "idEndTime" integer,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 &   DROP TABLE coach2."Routine_TimePair";
       coach2         heap    jasonalintonsql    false    10            0           1259    69158    Routine_TimePair_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Routine_TimePair_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE coach2."Routine_TimePair_id_seq";
       coach2          jasonalintonsql    false    305    10            �           0    0    Routine_TimePair_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE coach2."Routine_TimePair_id_seq" OWNED BY coach2."Routine_TimePair".id;
          coach2          jasonalintonsql    false    304                       1259    68952    Routine_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Routine_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE coach2."Routine_id_seq";
       coach2          jasonalintonsql    false    284    10            �           0    0    Routine_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE coach2."Routine_id_seq" OWNED BY coach2."Routine".id;
          coach2          jasonalintonsql    false    283            +           1259    69129    Time    TABLE     �  CREATE TABLE coach2."Time" (
    id integer NOT NULL,
    "idType" integer NOT NULL,
    "idEndpoint" integer NOT NULL,
    "idMoment" integer NOT NULL,
    "idFlexibility" integer NOT NULL,
    "dateTime" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE coach2."Time";
       coach2         heap    jasonalintonsql    false    10            *           1259    69127    Time_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Time_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE coach2."Time_id_seq";
       coach2          jasonalintonsql    false    10    299            �           0    0    Time_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE coach2."Time_id_seq" OWNED BY coach2."Time".id;
          coach2          jasonalintonsql    false    298                       1259    68940    Todo    TABLE     �  CREATE TABLE coach2."Todo" (
    id integer NOT NULL,
    text text NOT NULL,
    description text,
    "isDeleted" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dateTimeDeleted" timestamp(6) with time zone,
    "isGroup" boolean DEFAULT false NOT NULL,
    "position" text
);
    DROP TABLE coach2."Todo";
       coach2         heap    jasonalintonsql    false    10            7           1259    69190    Todo_Repeat    TABLE     �  CREATE TABLE coach2."Todo_Repeat" (
    id integer NOT NULL,
    "idTodo" integer NOT NULL,
    "idRepeat" integer NOT NULL,
    "lastIterationDateTime" timestamp(6) with time zone,
    "isEventVisible" boolean NOT NULL,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "isRecommended" boolean DEFAULT false NOT NULL
);
 !   DROP TABLE coach2."Todo_Repeat";
       coach2         heap    jasonalintonsql    false    10            6           1259    69188    Todo_Repeat_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Todo_Repeat_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE coach2."Todo_Repeat_id_seq";
       coach2          jasonalintonsql    false    10    311            �           0    0    Todo_Repeat_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE coach2."Todo_Repeat_id_seq" OWNED BY coach2."Todo_Repeat".id;
          coach2          jasonalintonsql    false    310            /           1259    69150    Todo_TimePair    TABLE     W  CREATE TABLE coach2."Todo_TimePair" (
    id integer NOT NULL,
    "idTodo" integer NOT NULL,
    "idTimeType" integer NOT NULL,
    "idStartTime" integer,
    "idEndTime" integer,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
 #   DROP TABLE coach2."Todo_TimePair";
       coach2         heap    jasonalintonsql    false    10            .           1259    69148    Todo_TimePair_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Todo_TimePair_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE coach2."Todo_TimePair_id_seq";
       coach2          jasonalintonsql    false    303    10            �           0    0    Todo_TimePair_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE coach2."Todo_TimePair_id_seq" OWNED BY coach2."Todo_TimePair".id;
          coach2          jasonalintonsql    false    302                       1259    68938    Todo_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Todo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE coach2."Todo_id_seq";
       coach2          jasonalintonsql    false    10    282            �           0    0    Todo_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE coach2."Todo_id_seq" OWNED BY coach2."Todo".id;
          coach2          jasonalintonsql    false    281            )           1259    69116    Type    TABLE       CREATE TABLE coach2."Type" (
    id integer NOT NULL,
    text text NOT NULL,
    "altText" text,
    description text,
    "createdAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
    DROP TABLE coach2."Type";
       coach2         heap    jasonalintonsql    false    10            (           1259    69114    Type_id_seq    SEQUENCE     �   CREATE SEQUENCE coach2."Type_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE coach2."Type_id_seq";
       coach2          jasonalintonsql    false    297    10            �           0    0    Type_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE coach2."Type_id_seq" OWNED BY coach2."Type".id;
          coach2          jasonalintonsql    false    296            �           1259    185738    _BlurbToGoal    TABLE     [   CREATE TABLE coach2."_BlurbToGoal" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 "   DROP TABLE coach2."_BlurbToGoal";
       coach2         heap    jasonalintonsql    false    10            A           1259    69559    _EventToIteration    TABLE     `   CREATE TABLE coach2."_EventToIteration" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 '   DROP TABLE coach2."_EventToIteration";
       coach2         heap    jasonalintonsql    false    10                       1259    68966    _GoalFamily    TABLE     Z   CREATE TABLE coach2."_GoalFamily" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 !   DROP TABLE coach2."_GoalFamily";
       coach2         heap    jasonalintonsql    false    10            %           1259    69069    _GoalToMetric    TABLE     \   CREATE TABLE coach2."_GoalToMetric" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 #   DROP TABLE coach2."_GoalToMetric";
       coach2         heap    jasonalintonsql    false    10            B           1259    69598    _GoalToRepeat    TABLE     \   CREATE TABLE coach2."_GoalToRepeat" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 #   DROP TABLE coach2."_GoalToRepeat";
       coach2         heap    jasonalintonsql    false    10                       1259    68972    _GoalToRoutine    TABLE     ]   CREATE TABLE coach2."_GoalToRoutine" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 $   DROP TABLE coach2."_GoalToRoutine";
       coach2         heap    jasonalintonsql    false    10                       1259    68969    _GoalToTodo    TABLE     Z   CREATE TABLE coach2."_GoalToTodo" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 !   DROP TABLE coach2."_GoalToTodo";
       coach2         heap    jasonalintonsql    false    10            '           1259    69075    _MetricToRoutine    TABLE     _   CREATE TABLE coach2."_MetricToRoutine" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 &   DROP TABLE coach2."_MetricToRoutine";
       coach2         heap    jasonalintonsql    false    10            &           1259    69072    _MetricToTodo    TABLE     \   CREATE TABLE coach2."_MetricToTodo" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 #   DROP TABLE coach2."_MetricToTodo";
       coach2         heap    jasonalintonsql    false    10            C           1259    69601    _RepeatToRoutine    TABLE     _   CREATE TABLE coach2."_RepeatToRoutine" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 &   DROP TABLE coach2."_RepeatToRoutine";
       coach2         heap    jasonalintonsql    false    10            <           1259    69483    _RepeatToTodo    TABLE     \   CREATE TABLE coach2."_RepeatToTodo" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 #   DROP TABLE coach2."_RepeatToTodo";
       coach2         heap    jasonalintonsql    false    10            "           1259    68981    _RoutineFamily    TABLE     ]   CREATE TABLE coach2."_RoutineFamily" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 $   DROP TABLE coach2."_RoutineFamily";
       coach2         heap    jasonalintonsql    false    10            !           1259    68978    _RoutineToTodo    TABLE     ]   CREATE TABLE coach2."_RoutineToTodo" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 $   DROP TABLE coach2."_RoutineToTodo";
       coach2         heap    jasonalintonsql    false    10                        1259    68975    _TodoFamily    TABLE     Z   CREATE TABLE coach2."_TodoFamily" (
    "A" integer NOT NULL,
    "B" integer NOT NULL
);
 !   DROP TABLE coach2."_TodoFamily";
       coach2         heap    jasonalintonsql    false    10                       1259    68914    _prisma_migrations    TABLE     �  CREATE TABLE coach2._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE coach2._prisma_migrations;
       coach2         heap    jasonalintonsql    false    10            �           2604    185730    Blurb id    DEFAULT     h   ALTER TABLE ONLY coach2."Blurb" ALTER COLUMN id SET DEFAULT nextval('coach2."Blurb_id_seq"'::regclass);
 9   ALTER TABLE coach2."Blurb" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    478    479    479            �           2604    69542    Event id    DEFAULT     h   ALTER TABLE ONLY coach2."Event" ALTER COLUMN id SET DEFAULT nextval('coach2."Event_id_seq"'::regclass);
 9   ALTER TABLE coach2."Event" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    320    319    320            c           2604    68929    Goal id    DEFAULT     f   ALTER TABLE ONLY coach2."Goal" ALTER COLUMN id SET DEFAULT nextval('coach2."Goal_id_seq"'::regclass);
 8   ALTER TABLE coach2."Goal" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    280    279    280            �           2604    69183    Goal_Repeat id    DEFAULT     t   ALTER TABLE ONLY coach2."Goal_Repeat" ALTER COLUMN id SET DEFAULT nextval('coach2."Goal_Repeat_id_seq"'::regclass);
 ?   ALTER TABLE coach2."Goal_Repeat" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    308    309    309            z           2604    69143    Goal_TimePair id    DEFAULT     x   ALTER TABLE ONLY coach2."Goal_TimePair" ALTER COLUMN id SET DEFAULT nextval('coach2."Goal_TimePair_id_seq"'::regclass);
 A   ALTER TABLE coach2."Goal_TimePair" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    300    301    301            �           2604    205151    Goal_Todo id    DEFAULT     p   ALTER TABLE ONLY coach2."Goal_Todo" ALTER COLUMN id SET DEFAULT nextval('coach2."Goal_Todo_id_seq"'::regclass);
 =   ALTER TABLE coach2."Goal_Todo" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    482    481    482            �           2604    69528    Iteration id    DEFAULT     p   ALTER TABLE ONLY coach2."Iteration" ALTER COLUMN id SET DEFAULT nextval('coach2."Iteration_id_seq"'::regclass);
 =   ALTER TABLE coach2."Iteration" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    317    318    318            p           2604    69061 	   Metric id    DEFAULT     j   ALTER TABLE ONLY coach2."Metric" ALTER COLUMN id SET DEFAULT nextval('coach2."Metric_id_seq"'::regclass);
 :   ALTER TABLE coach2."Metric" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    292    291    292            �           2604    69173 	   Repeat id    DEFAULT     j   ALTER TABLE ONLY coach2."Repeat" ALTER COLUMN id SET DEFAULT nextval('coach2."Repeat_id_seq"'::regclass);
 :   ALTER TABLE coach2."Repeat" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    306    307    307            �           2604    69438    Repeat_DayIndex id    DEFAULT     |   ALTER TABLE ONLY coach2."Repeat_DayIndex" ALTER COLUMN id SET DEFAULT nextval('coach2."Repeat_DayIndex_id_seq"'::regclass);
 C   ALTER TABLE coach2."Repeat_DayIndex" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    315    314    315            l           2604    68957 
   Routine id    DEFAULT     l   ALTER TABLE ONLY coach2."Routine" ALTER COLUMN id SET DEFAULT nextval('coach2."Routine_id_seq"'::regclass);
 ;   ALTER TABLE coach2."Routine" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    284    283    284            �           2604    86705    RoutineTodo_Iteration id    DEFAULT     �   ALTER TABLE ONLY coach2."RoutineTodo_Iteration" ALTER COLUMN id SET DEFAULT nextval('coach2."RoutineTodo_Iteration_id_seq"'::regclass);
 I   ALTER TABLE coach2."RoutineTodo_Iteration" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    374    375    375            �           2604    69203    Routine_Repeat id    DEFAULT     z   ALTER TABLE ONLY coach2."Routine_Repeat" ALTER COLUMN id SET DEFAULT nextval('coach2."Routine_Repeat_id_seq"'::regclass);
 B   ALTER TABLE coach2."Routine_Repeat" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    313    312    313            �           2604    69163    Routine_TimePair id    DEFAULT     ~   ALTER TABLE ONLY coach2."Routine_TimePair" ALTER COLUMN id SET DEFAULT nextval('coach2."Routine_TimePair_id_seq"'::regclass);
 D   ALTER TABLE coach2."Routine_TimePair" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    304    305    305            v           2604    69132    Time id    DEFAULT     f   ALTER TABLE ONLY coach2."Time" ALTER COLUMN id SET DEFAULT nextval('coach2."Time_id_seq"'::regclass);
 8   ALTER TABLE coach2."Time" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    298    299    299            g           2604    68943    Todo id    DEFAULT     f   ALTER TABLE ONLY coach2."Todo" ALTER COLUMN id SET DEFAULT nextval('coach2."Todo_id_seq"'::regclass);
 8   ALTER TABLE coach2."Todo" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    281    282    282            �           2604    69193    Todo_Repeat id    DEFAULT     t   ALTER TABLE ONLY coach2."Todo_Repeat" ALTER COLUMN id SET DEFAULT nextval('coach2."Todo_Repeat_id_seq"'::regclass);
 ?   ALTER TABLE coach2."Todo_Repeat" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    310    311    311            }           2604    69153    Todo_TimePair id    DEFAULT     x   ALTER TABLE ONLY coach2."Todo_TimePair" ALTER COLUMN id SET DEFAULT nextval('coach2."Todo_TimePair_id_seq"'::regclass);
 A   ALTER TABLE coach2."Todo_TimePair" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    303    302    303            s           2604    69119    Type id    DEFAULT     f   ALTER TABLE ONLY coach2."Type" ALTER COLUMN id SET DEFAULT nextval('coach2."Type_id_seq"'::regclass);
 8   ALTER TABLE coach2."Type" ALTER COLUMN id DROP DEFAULT;
       coach2          jasonalintonsql    false    297    296    297            �          0    185727    Blurb 
   TABLE DATA           E   COPY coach2."Blurb" (id, text, "createdAt", "updatedAt") FROM stdin;
    coach2          jasonalintonsql    false    479   
m      �          0    69539    Event 
   TABLE DATA           �   COPY coach2."Event" (id, text, "isAllDay", "isRecommended", "isSynced", "idGoogleEvent", "createdAt", "updatedAt", "endAt", "startAt", "idType") FROM stdin;
    coach2          jasonalintonsql    false    320   'm      �          0    68926    Goal 
   TABLE DATA           �   COPY coach2."Goal" (id, text, description, "isDeleted", "createdAt", "updatedAt", "dateTimeDeleted", "idType", "position") FROM stdin;
    coach2          jasonalintonsql    false    280   �      �          0    69180    Goal_Repeat 
   TABLE DATA           �   COPY coach2."Goal_Repeat" (id, "idGoal", "idRepeat", "lastIterationDateTime", "isEventVisible", "createdAt", "updatedAt", "isRecommended") FROM stdin;
    coach2          jasonalintonsql    false    309   X�      �          0    69140    Goal_TimePair 
   TABLE DATA           {   COPY coach2."Goal_TimePair" (id, "idGoal", "idTimeType", "idStartTime", "idEndTime", "createdAt", "updatedAt") FROM stdin;
    coach2          jasonalintonsql    false    301   u�      �          0    205148 	   Goal_Todo 
   TABLE DATA           Z   COPY coach2."Goal_Todo" (id, "idGoal_Parent", "idTodo_Child", "todoPosition") FROM stdin;
    coach2          jasonalintonsql    false    482   �      �          0    69525 	   Iteration 
   TABLE DATA             COPY coach2."Iteration" (id, text, "isRecommended", "idGoogleTask", "idGoogleTaskList", "createdAt", "updatedAt", "attemptedAt", "completedAt", "endAt", "startAt", "idRepeat", "idRoutineIteration", "idRoutineRepeat", "idTodoRepeat", "idRoutine", "idTodo", "idTodoTimePair") FROM stdin;
    coach2          jasonalintonsql    false    318   �      �          0    69058    Metric 
   TABLE DATA           S   COPY coach2."Metric" (id, text, description, "createdAt", "updatedAt") FROM stdin;
    coach2          jasonalintonsql    false    292   	I      �          0    69170    Repeat 
   TABLE DATA           �   COPY coach2."Repeat" (id, "idType", "idTimeframe", "idStartRepeat", "idEndRepeat", "idStartIteration", "idEndIteration", "interval", frequency, "createdAt", "updatedAt", "idRoutineRepeat") FROM stdin;
    coach2          jasonalintonsql    false    307   zI      �          0    69435    Repeat_DayIndex 
   TABLE DATA           \   COPY coach2."Repeat_DayIndex" (id, "idRepeat", index, "createdAt", "updatedAt") FROM stdin;
    coach2          jasonalintonsql    false    315   �L      �          0    68954    Routine 
   TABLE DATA           �   COPY coach2."Routine" (id, text, description, "isDeleted", "createdAt", "updatedAt", "dateTimeDeleted", "position") FROM stdin;
    coach2          jasonalintonsql    false    284   KM      �          0    86702    RoutineTodo_Iteration 
   TABLE DATA           [   COPY coach2."RoutineTodo_Iteration" (id, "idRoutineIteration", "hasTodoEvent") FROM stdin;
    coach2          jasonalintonsql    false    375   KN      �          0    69200    Routine_Repeat 
   TABLE DATA           �   COPY coach2."Routine_Repeat" (id, "idRoutine", "idRepeat", "lastIterationDateTime", "isEventVisible", "createdAt", "updatedAt", "isRecommended") FROM stdin;
    coach2          jasonalintonsql    false    313   'T      �          0    69160    Routine_TimePair 
   TABLE DATA           �   COPY coach2."Routine_TimePair" (id, "idRoutine", "idTimeType", "idStartTime", "idEndTime", "createdAt", "updatedAt") FROM stdin;
    coach2          jasonalintonsql    false    305   �T      �          0    69129    Time 
   TABLE DATA              COPY coach2."Time" (id, "idType", "idEndpoint", "idMoment", "idFlexibility", "dateTime", "createdAt", "updatedAt") FROM stdin;
    coach2          jasonalintonsql    false    299   �T      �          0    68940    Todo 
   TABLE DATA           �   COPY coach2."Todo" (id, text, description, "isDeleted", "createdAt", "updatedAt", "dateTimeDeleted", "isGroup", "position") FROM stdin;
    coach2          jasonalintonsql    false    282   @g      �          0    69190    Todo_Repeat 
   TABLE DATA           �   COPY coach2."Todo_Repeat" (id, "idTodo", "idRepeat", "lastIterationDateTime", "isEventVisible", "createdAt", "updatedAt", "isRecommended") FROM stdin;
    coach2          jasonalintonsql    false    311   `�      �          0    69150    Todo_TimePair 
   TABLE DATA           {   COPY coach2."Todo_TimePair" (id, "idTodo", "idTimeType", "idStartTime", "idEndTime", "createdAt", "updatedAt") FROM stdin;
    coach2          jasonalintonsql    false    303   �      �          0    69116    Type 
   TABLE DATA           \   COPY coach2."Type" (id, text, "altText", description, "createdAt", "updatedAt") FROM stdin;
    coach2          jasonalintonsql    false    297   F�      �          0    185738    _BlurbToGoal 
   TABLE DATA           2   COPY coach2."_BlurbToGoal" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    480   E�      �          0    69559    _EventToIteration 
   TABLE DATA           7   COPY coach2."_EventToIteration" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    321   b�      �          0    68966    _GoalFamily 
   TABLE DATA           1   COPY coach2."_GoalFamily" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    285   ��      �          0    69069    _GoalToMetric 
   TABLE DATA           3   COPY coach2."_GoalToMetric" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    293   5�      �          0    69598    _GoalToRepeat 
   TABLE DATA           3   COPY coach2."_GoalToRepeat" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    322   ��      �          0    68972    _GoalToRoutine 
   TABLE DATA           4   COPY coach2."_GoalToRoutine" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    287   ��      �          0    68969    _GoalToTodo 
   TABLE DATA           1   COPY coach2."_GoalToTodo" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    286   ��      �          0    69075    _MetricToRoutine 
   TABLE DATA           6   COPY coach2."_MetricToRoutine" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    295   ��      �          0    69072    _MetricToTodo 
   TABLE DATA           3   COPY coach2."_MetricToTodo" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    294   ��      �          0    69601    _RepeatToRoutine 
   TABLE DATA           6   COPY coach2."_RepeatToRoutine" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    323   ��      �          0    69483    _RepeatToTodo 
   TABLE DATA           3   COPY coach2."_RepeatToTodo" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    316   ��      �          0    68981    _RoutineFamily 
   TABLE DATA           4   COPY coach2."_RoutineFamily" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    290   9�      �          0    68978    _RoutineToTodo 
   TABLE DATA           4   COPY coach2."_RoutineToTodo" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    289   V�      �          0    68975    _TodoFamily 
   TABLE DATA           1   COPY coach2."_TodoFamily" ("A", "B") FROM stdin;
    coach2          jasonalintonsql    false    288   ��      �          0    68914    _prisma_migrations 
   TABLE DATA           �   COPY coach2._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    coach2          jasonalintonsql    false    278   N�                  0    0    Blurb_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('coach2."Blurb_id_seq"', 1, false);
          coach2          jasonalintonsql    false    478                       0    0    Event_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('coach2."Event_id_seq"', 3007, true);
          coach2          jasonalintonsql    false    319                       0    0    Goal_Repeat_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('coach2."Goal_Repeat_id_seq"', 1, false);
          coach2          jasonalintonsql    false    308                       0    0    Goal_TimePair_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('coach2."Goal_TimePair_id_seq"', 4, true);
          coach2          jasonalintonsql    false    300                       0    0    Goal_Todo_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('coach2."Goal_Todo_id_seq"', 1, false);
          coach2          jasonalintonsql    false    481                       0    0    Goal_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('coach2."Goal_id_seq"', 120, true);
          coach2          jasonalintonsql    false    279                       0    0    Iteration_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('coach2."Iteration_id_seq"', 32818, true);
          coach2          jasonalintonsql    false    317                       0    0    Metric_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('coach2."Metric_id_seq"', 5, true);
          coach2          jasonalintonsql    false    291                       0    0    Repeat_DayIndex_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('coach2."Repeat_DayIndex_id_seq"', 18, true);
          coach2          jasonalintonsql    false    314            	           0    0    Repeat_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('coach2."Repeat_id_seq"', 51, true);
          coach2          jasonalintonsql    false    306            
           0    0    RoutineTodo_Iteration_id_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('coach2."RoutineTodo_Iteration_id_seq"', 1267, true);
          coach2          jasonalintonsql    false    374                       0    0    Routine_Repeat_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('coach2."Routine_Repeat_id_seq"', 9, true);
          coach2          jasonalintonsql    false    312                       0    0    Routine_TimePair_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('coach2."Routine_TimePair_id_seq"', 1, false);
          coach2          jasonalintonsql    false    304                       0    0    Routine_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('coach2."Routine_id_seq"', 5, true);
          coach2          jasonalintonsql    false    283                       0    0    Time_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('coach2."Time_id_seq"', 378, true);
          coach2          jasonalintonsql    false    298                       0    0    Todo_Repeat_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('coach2."Todo_Repeat_id_seq"', 127, true);
          coach2          jasonalintonsql    false    310                       0    0    Todo_TimePair_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('coach2."Todo_TimePair_id_seq"', 181, true);
          coach2          jasonalintonsql    false    302                       0    0    Todo_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('coach2."Todo_id_seq"', 261, true);
          coach2          jasonalintonsql    false    281                       0    0    Type_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('coach2."Type_id_seq"', 12, true);
          coach2          jasonalintonsql    false    296            �           2606    185737    Blurb Blurb_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY coach2."Blurb"
    ADD CONSTRAINT "Blurb_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY coach2."Blurb" DROP CONSTRAINT "Blurb_pkey";
       coach2            jasonalintonsql    false    479            �           2606    69552    Event Event_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY coach2."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY coach2."Event" DROP CONSTRAINT "Event_pkey";
       coach2            jasonalintonsql    false    320            �           2606    69187    Goal_Repeat Goal_Repeat_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY coach2."Goal_Repeat"
    ADD CONSTRAINT "Goal_Repeat_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY coach2."Goal_Repeat" DROP CONSTRAINT "Goal_Repeat_pkey";
       coach2            jasonalintonsql    false    309            �           2606    69147     Goal_TimePair Goal_TimePair_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY coach2."Goal_TimePair"
    ADD CONSTRAINT "Goal_TimePair_pkey" PRIMARY KEY (id);
 N   ALTER TABLE ONLY coach2."Goal_TimePair" DROP CONSTRAINT "Goal_TimePair_pkey";
       coach2            jasonalintonsql    false    301            �           2606    205153    Goal_Todo Goal_Todo_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY coach2."Goal_Todo"
    ADD CONSTRAINT "Goal_Todo_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY coach2."Goal_Todo" DROP CONSTRAINT "Goal_Todo_pkey";
       coach2            jasonalintonsql    false    482            �           2606    68937    Goal Goal_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY coach2."Goal"
    ADD CONSTRAINT "Goal_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY coach2."Goal" DROP CONSTRAINT "Goal_pkey";
       coach2            jasonalintonsql    false    280            �           2606    69536    Iteration Iteration_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY coach2."Iteration"
    ADD CONSTRAINT "Iteration_pkey" PRIMARY KEY (id);
 F   ALTER TABLE ONLY coach2."Iteration" DROP CONSTRAINT "Iteration_pkey";
       coach2            jasonalintonsql    false    318            �           2606    69068    Metric Metric_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY coach2."Metric"
    ADD CONSTRAINT "Metric_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY coach2."Metric" DROP CONSTRAINT "Metric_pkey";
       coach2            jasonalintonsql    false    292            �           2606    69442 $   Repeat_DayIndex Repeat_DayIndex_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY coach2."Repeat_DayIndex"
    ADD CONSTRAINT "Repeat_DayIndex_pkey" PRIMARY KEY (id);
 R   ALTER TABLE ONLY coach2."Repeat_DayIndex" DROP CONSTRAINT "Repeat_DayIndex_pkey";
       coach2            jasonalintonsql    false    315            �           2606    69177    Repeat Repeat_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY coach2."Repeat"
    ADD CONSTRAINT "Repeat_pkey" PRIMARY KEY (id);
 @   ALTER TABLE ONLY coach2."Repeat" DROP CONSTRAINT "Repeat_pkey";
       coach2            jasonalintonsql    false    307            �           2606    86708 0   RoutineTodo_Iteration RoutineTodo_Iteration_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY coach2."RoutineTodo_Iteration"
    ADD CONSTRAINT "RoutineTodo_Iteration_pkey" PRIMARY KEY (id);
 ^   ALTER TABLE ONLY coach2."RoutineTodo_Iteration" DROP CONSTRAINT "RoutineTodo_Iteration_pkey";
       coach2            jasonalintonsql    false    375            �           2606    69207 "   Routine_Repeat Routine_Repeat_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY coach2."Routine_Repeat"
    ADD CONSTRAINT "Routine_Repeat_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY coach2."Routine_Repeat" DROP CONSTRAINT "Routine_Repeat_pkey";
       coach2            jasonalintonsql    false    313            �           2606    69167 &   Routine_TimePair Routine_TimePair_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY coach2."Routine_TimePair"
    ADD CONSTRAINT "Routine_TimePair_pkey" PRIMARY KEY (id);
 T   ALTER TABLE ONLY coach2."Routine_TimePair" DROP CONSTRAINT "Routine_TimePair_pkey";
       coach2            jasonalintonsql    false    305            �           2606    68965    Routine Routine_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY coach2."Routine"
    ADD CONSTRAINT "Routine_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY coach2."Routine" DROP CONSTRAINT "Routine_pkey";
       coach2            jasonalintonsql    false    284            �           2606    69137    Time Time_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY coach2."Time"
    ADD CONSTRAINT "Time_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY coach2."Time" DROP CONSTRAINT "Time_pkey";
       coach2            jasonalintonsql    false    299            �           2606    69197    Todo_Repeat Todo_Repeat_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY coach2."Todo_Repeat"
    ADD CONSTRAINT "Todo_Repeat_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY coach2."Todo_Repeat" DROP CONSTRAINT "Todo_Repeat_pkey";
       coach2            jasonalintonsql    false    311            �           2606    69157     Todo_TimePair Todo_TimePair_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY coach2."Todo_TimePair"
    ADD CONSTRAINT "Todo_TimePair_pkey" PRIMARY KEY (id);
 N   ALTER TABLE ONLY coach2."Todo_TimePair" DROP CONSTRAINT "Todo_TimePair_pkey";
       coach2            jasonalintonsql    false    303            �           2606    68951    Todo Todo_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY coach2."Todo"
    ADD CONSTRAINT "Todo_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY coach2."Todo" DROP CONSTRAINT "Todo_pkey";
       coach2            jasonalintonsql    false    282            �           2606    69126    Type Type_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY coach2."Type"
    ADD CONSTRAINT "Type_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY coach2."Type" DROP CONSTRAINT "Type_pkey";
       coach2            jasonalintonsql    false    297            �           2606    68923 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY coach2._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY coach2._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       coach2            jasonalintonsql    false    278            �           1259    86709 ,   RoutineTodo_Iteration_idRoutineIteration_key    INDEX     �   CREATE UNIQUE INDEX "RoutineTodo_Iteration_idRoutineIteration_key" ON coach2."RoutineTodo_Iteration" USING btree ("idRoutineIteration");
 B   DROP INDEX coach2."RoutineTodo_Iteration_idRoutineIteration_key";
       coach2            jasonalintonsql    false    375            �           1259    185741    _BlurbToGoal_AB_unique    INDEX     ^   CREATE UNIQUE INDEX "_BlurbToGoal_AB_unique" ON coach2."_BlurbToGoal" USING btree ("A", "B");
 ,   DROP INDEX coach2."_BlurbToGoal_AB_unique";
       coach2            jasonalintonsql    false    480    480            �           1259    185742    _BlurbToGoal_B_index    INDEX     P   CREATE INDEX "_BlurbToGoal_B_index" ON coach2."_BlurbToGoal" USING btree ("B");
 *   DROP INDEX coach2."_BlurbToGoal_B_index";
       coach2            jasonalintonsql    false    480            �           1259    69566    _EventToIteration_AB_unique    INDEX     h   CREATE UNIQUE INDEX "_EventToIteration_AB_unique" ON coach2."_EventToIteration" USING btree ("A", "B");
 1   DROP INDEX coach2."_EventToIteration_AB_unique";
       coach2            jasonalintonsql    false    321    321            �           1259    69567    _EventToIteration_B_index    INDEX     Z   CREATE INDEX "_EventToIteration_B_index" ON coach2."_EventToIteration" USING btree ("B");
 /   DROP INDEX coach2."_EventToIteration_B_index";
       coach2            jasonalintonsql    false    321            �           1259    68984    _GoalFamily_AB_unique    INDEX     \   CREATE UNIQUE INDEX "_GoalFamily_AB_unique" ON coach2."_GoalFamily" USING btree ("A", "B");
 +   DROP INDEX coach2."_GoalFamily_AB_unique";
       coach2            jasonalintonsql    false    285    285            �           1259    68985    _GoalFamily_B_index    INDEX     N   CREATE INDEX "_GoalFamily_B_index" ON coach2."_GoalFamily" USING btree ("B");
 )   DROP INDEX coach2."_GoalFamily_B_index";
       coach2            jasonalintonsql    false    285            �           1259    69078    _GoalToMetric_AB_unique    INDEX     `   CREATE UNIQUE INDEX "_GoalToMetric_AB_unique" ON coach2."_GoalToMetric" USING btree ("A", "B");
 -   DROP INDEX coach2."_GoalToMetric_AB_unique";
       coach2            jasonalintonsql    false    293    293            �           1259    69079    _GoalToMetric_B_index    INDEX     R   CREATE INDEX "_GoalToMetric_B_index" ON coach2."_GoalToMetric" USING btree ("B");
 +   DROP INDEX coach2."_GoalToMetric_B_index";
       coach2            jasonalintonsql    false    293            �           1259    69604    _GoalToRepeat_AB_unique    INDEX     `   CREATE UNIQUE INDEX "_GoalToRepeat_AB_unique" ON coach2."_GoalToRepeat" USING btree ("A", "B");
 -   DROP INDEX coach2."_GoalToRepeat_AB_unique";
       coach2            jasonalintonsql    false    322    322            �           1259    69605    _GoalToRepeat_B_index    INDEX     R   CREATE INDEX "_GoalToRepeat_B_index" ON coach2."_GoalToRepeat" USING btree ("B");
 +   DROP INDEX coach2."_GoalToRepeat_B_index";
       coach2            jasonalintonsql    false    322            �           1259    68988    _GoalToRoutine_AB_unique    INDEX     b   CREATE UNIQUE INDEX "_GoalToRoutine_AB_unique" ON coach2."_GoalToRoutine" USING btree ("A", "B");
 .   DROP INDEX coach2."_GoalToRoutine_AB_unique";
       coach2            jasonalintonsql    false    287    287            �           1259    68989    _GoalToRoutine_B_index    INDEX     T   CREATE INDEX "_GoalToRoutine_B_index" ON coach2."_GoalToRoutine" USING btree ("B");
 ,   DROP INDEX coach2."_GoalToRoutine_B_index";
       coach2            jasonalintonsql    false    287            �           1259    68986    _GoalToTodo_AB_unique    INDEX     \   CREATE UNIQUE INDEX "_GoalToTodo_AB_unique" ON coach2."_GoalToTodo" USING btree ("A", "B");
 +   DROP INDEX coach2."_GoalToTodo_AB_unique";
       coach2            jasonalintonsql    false    286    286            �           1259    68987    _GoalToTodo_B_index    INDEX     N   CREATE INDEX "_GoalToTodo_B_index" ON coach2."_GoalToTodo" USING btree ("B");
 )   DROP INDEX coach2."_GoalToTodo_B_index";
       coach2            jasonalintonsql    false    286            �           1259    69082    _MetricToRoutine_AB_unique    INDEX     f   CREATE UNIQUE INDEX "_MetricToRoutine_AB_unique" ON coach2."_MetricToRoutine" USING btree ("A", "B");
 0   DROP INDEX coach2."_MetricToRoutine_AB_unique";
       coach2            jasonalintonsql    false    295    295            �           1259    69083    _MetricToRoutine_B_index    INDEX     X   CREATE INDEX "_MetricToRoutine_B_index" ON coach2."_MetricToRoutine" USING btree ("B");
 .   DROP INDEX coach2."_MetricToRoutine_B_index";
       coach2            jasonalintonsql    false    295            �           1259    69080    _MetricToTodo_AB_unique    INDEX     `   CREATE UNIQUE INDEX "_MetricToTodo_AB_unique" ON coach2."_MetricToTodo" USING btree ("A", "B");
 -   DROP INDEX coach2."_MetricToTodo_AB_unique";
       coach2            jasonalintonsql    false    294    294            �           1259    69081    _MetricToTodo_B_index    INDEX     R   CREATE INDEX "_MetricToTodo_B_index" ON coach2."_MetricToTodo" USING btree ("B");
 +   DROP INDEX coach2."_MetricToTodo_B_index";
       coach2            jasonalintonsql    false    294            �           1259    69606    _RepeatToRoutine_AB_unique    INDEX     f   CREATE UNIQUE INDEX "_RepeatToRoutine_AB_unique" ON coach2."_RepeatToRoutine" USING btree ("A", "B");
 0   DROP INDEX coach2."_RepeatToRoutine_AB_unique";
       coach2            jasonalintonsql    false    323    323            �           1259    69607    _RepeatToRoutine_B_index    INDEX     X   CREATE INDEX "_RepeatToRoutine_B_index" ON coach2."_RepeatToRoutine" USING btree ("B");
 .   DROP INDEX coach2."_RepeatToRoutine_B_index";
       coach2            jasonalintonsql    false    323            �           1259    69489    _RepeatToTodo_AB_unique    INDEX     `   CREATE UNIQUE INDEX "_RepeatToTodo_AB_unique" ON coach2."_RepeatToTodo" USING btree ("A", "B");
 -   DROP INDEX coach2."_RepeatToTodo_AB_unique";
       coach2            jasonalintonsql    false    316    316            �           1259    69490    _RepeatToTodo_B_index    INDEX     R   CREATE INDEX "_RepeatToTodo_B_index" ON coach2."_RepeatToTodo" USING btree ("B");
 +   DROP INDEX coach2."_RepeatToTodo_B_index";
       coach2            jasonalintonsql    false    316            �           1259    68994    _RoutineFamily_AB_unique    INDEX     b   CREATE UNIQUE INDEX "_RoutineFamily_AB_unique" ON coach2."_RoutineFamily" USING btree ("A", "B");
 .   DROP INDEX coach2."_RoutineFamily_AB_unique";
       coach2            jasonalintonsql    false    290    290            �           1259    68995    _RoutineFamily_B_index    INDEX     T   CREATE INDEX "_RoutineFamily_B_index" ON coach2."_RoutineFamily" USING btree ("B");
 ,   DROP INDEX coach2."_RoutineFamily_B_index";
       coach2            jasonalintonsql    false    290            �           1259    68992    _RoutineToTodo_AB_unique    INDEX     b   CREATE UNIQUE INDEX "_RoutineToTodo_AB_unique" ON coach2."_RoutineToTodo" USING btree ("A", "B");
 .   DROP INDEX coach2."_RoutineToTodo_AB_unique";
       coach2            jasonalintonsql    false    289    289            �           1259    68993    _RoutineToTodo_B_index    INDEX     T   CREATE INDEX "_RoutineToTodo_B_index" ON coach2."_RoutineToTodo" USING btree ("B");
 ,   DROP INDEX coach2."_RoutineToTodo_B_index";
       coach2            jasonalintonsql    false    289            �           1259    68990    _TodoFamily_AB_unique    INDEX     \   CREATE UNIQUE INDEX "_TodoFamily_AB_unique" ON coach2."_TodoFamily" USING btree ("A", "B");
 +   DROP INDEX coach2."_TodoFamily_AB_unique";
       coach2            jasonalintonsql    false    288    288            �           1259    68991    _TodoFamily_B_index    INDEX     N   CREATE INDEX "_TodoFamily_B_index" ON coach2."_TodoFamily" USING btree ("B");
 )   DROP INDEX coach2."_TodoFamily_B_index";
       coach2            jasonalintonsql    false    288            $           2606    133180    Event Event_idType_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Event"
    ADD CONSTRAINT "Event_idType_fkey" FOREIGN KEY ("idType") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 E   ALTER TABLE ONLY coach2."Event" DROP CONSTRAINT "Event_idType_fkey";
       coach2          jasonalintonsql    false    4034    320    297                       2606    185808 #   Goal_Repeat Goal_Repeat_idGoal_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Goal_Repeat"
    ADD CONSTRAINT "Goal_Repeat_idGoal_fkey" FOREIGN KEY ("idGoal") REFERENCES coach2."Goal"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 Q   ALTER TABLE ONLY coach2."Goal_Repeat" DROP CONSTRAINT "Goal_Repeat_idGoal_fkey";
       coach2          jasonalintonsql    false    309    4008    280                       2606    185813 %   Goal_Repeat Goal_Repeat_idRepeat_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Goal_Repeat"
    ADD CONSTRAINT "Goal_Repeat_idRepeat_fkey" FOREIGN KEY ("idRepeat") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 S   ALTER TABLE ONLY coach2."Goal_Repeat" DROP CONSTRAINT "Goal_Repeat_idRepeat_fkey";
       coach2          jasonalintonsql    false    307    4044    309                       2606    69273 *   Goal_TimePair Goal_TimePair_idEndTime_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Goal_TimePair"
    ADD CONSTRAINT "Goal_TimePair_idEndTime_fkey" FOREIGN KEY ("idEndTime") REFERENCES coach2."Time"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 X   ALTER TABLE ONLY coach2."Goal_TimePair" DROP CONSTRAINT "Goal_TimePair_idEndTime_fkey";
       coach2          jasonalintonsql    false    301    299    4036                       2606    185763 '   Goal_TimePair Goal_TimePair_idGoal_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Goal_TimePair"
    ADD CONSTRAINT "Goal_TimePair_idGoal_fkey" FOREIGN KEY ("idGoal") REFERENCES coach2."Goal"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 U   ALTER TABLE ONLY coach2."Goal_TimePair" DROP CONSTRAINT "Goal_TimePair_idGoal_fkey";
       coach2          jasonalintonsql    false    301    4008    280                       2606    69268 ,   Goal_TimePair Goal_TimePair_idStartTime_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Goal_TimePair"
    ADD CONSTRAINT "Goal_TimePair_idStartTime_fkey" FOREIGN KEY ("idStartTime") REFERENCES coach2."Time"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 Z   ALTER TABLE ONLY coach2."Goal_TimePair" DROP CONSTRAINT "Goal_TimePair_idStartTime_fkey";
       coach2          jasonalintonsql    false    299    4036    301                       2606    185768 +   Goal_TimePair Goal_TimePair_idTimeType_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Goal_TimePair"
    ADD CONSTRAINT "Goal_TimePair_idTimeType_fkey" FOREIGN KEY ("idTimeType") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 Y   ALTER TABLE ONLY coach2."Goal_TimePair" DROP CONSTRAINT "Goal_TimePair_idTimeType_fkey";
       coach2          jasonalintonsql    false    4034    297    301            .           2606    205154 &   Goal_Todo Goal_Todo_idGoal_Parent_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Goal_Todo"
    ADD CONSTRAINT "Goal_Todo_idGoal_Parent_fkey" FOREIGN KEY ("idGoal_Parent") REFERENCES coach2."Goal"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 T   ALTER TABLE ONLY coach2."Goal_Todo" DROP CONSTRAINT "Goal_Todo_idGoal_Parent_fkey";
       coach2          jasonalintonsql    false    482    280    4008            /           2606    205159 %   Goal_Todo Goal_Todo_idTodo_Child_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Goal_Todo"
    ADD CONSTRAINT "Goal_Todo_idTodo_Child_fkey" FOREIGN KEY ("idTodo_Child") REFERENCES coach2."Todo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 S   ALTER TABLE ONLY coach2."Goal_Todo" DROP CONSTRAINT "Goal_Todo_idTodo_Child_fkey";
       coach2          jasonalintonsql    false    282    4010    482            �           2606    185853    Goal Goal_idType_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Goal"
    ADD CONSTRAINT "Goal_idType_fkey" FOREIGN KEY ("idType") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 C   ALTER TABLE ONLY coach2."Goal" DROP CONSTRAINT "Goal_idType_fkey";
       coach2          jasonalintonsql    false    4034    280    297                       2606    69646 !   Iteration Iteration_idRepeat_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Iteration"
    ADD CONSTRAINT "Iteration_idRepeat_fkey" FOREIGN KEY ("idRepeat") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 O   ALTER TABLE ONLY coach2."Iteration" DROP CONSTRAINT "Iteration_idRepeat_fkey";
       coach2          jasonalintonsql    false    318    307    4044                        2606    86725 +   Iteration Iteration_idRoutineIteration_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Iteration"
    ADD CONSTRAINT "Iteration_idRoutineIteration_fkey" FOREIGN KEY ("idRoutineIteration") REFERENCES coach2."RoutineTodo_Iteration"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 Y   ALTER TABLE ONLY coach2."Iteration" DROP CONSTRAINT "Iteration_idRoutineIteration_fkey";
       coach2          jasonalintonsql    false    375    318    4067                       2606    86720 (   Iteration Iteration_idRoutineRepeat_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Iteration"
    ADD CONSTRAINT "Iteration_idRoutineRepeat_fkey" FOREIGN KEY ("idRoutineRepeat") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 V   ALTER TABLE ONLY coach2."Iteration" DROP CONSTRAINT "Iteration_idRoutineRepeat_fkey";
       coach2          jasonalintonsql    false    307    318    4044            "           2606    133175 "   Iteration Iteration_idRoutine_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Iteration"
    ADD CONSTRAINT "Iteration_idRoutine_fkey" FOREIGN KEY ("idRoutine") REFERENCES coach2."Routine"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 P   ALTER TABLE ONLY coach2."Iteration" DROP CONSTRAINT "Iteration_idRoutine_fkey";
       coach2          jasonalintonsql    false    4012    318    284                       2606    86715 %   Iteration Iteration_idTodoRepeat_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Iteration"
    ADD CONSTRAINT "Iteration_idTodoRepeat_fkey" FOREIGN KEY ("idTodoRepeat") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 S   ALTER TABLE ONLY coach2."Iteration" DROP CONSTRAINT "Iteration_idTodoRepeat_fkey";
       coach2          jasonalintonsql    false    307    318    4044            #           2606    199453 '   Iteration Iteration_idTodoTimePair_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Iteration"
    ADD CONSTRAINT "Iteration_idTodoTimePair_fkey" FOREIGN KEY ("idTodoTimePair") REFERENCES coach2."Todo_TimePair"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 U   ALTER TABLE ONLY coach2."Iteration" DROP CONSTRAINT "Iteration_idTodoTimePair_fkey";
       coach2          jasonalintonsql    false    303    4040    318            !           2606    133170    Iteration Iteration_idTodo_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Iteration"
    ADD CONSTRAINT "Iteration_idTodo_fkey" FOREIGN KEY ("idTodo") REFERENCES coach2."Todo"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 M   ALTER TABLE ONLY coach2."Iteration" DROP CONSTRAINT "Iteration_idTodo_fkey";
       coach2          jasonalintonsql    false    318    4010    282                       2606    185803 -   Repeat_DayIndex Repeat_DayIndex_idRepeat_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Repeat_DayIndex"
    ADD CONSTRAINT "Repeat_DayIndex_idRepeat_fkey" FOREIGN KEY ("idRepeat") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 [   ALTER TABLE ONLY coach2."Repeat_DayIndex" DROP CONSTRAINT "Repeat_DayIndex_idRepeat_fkey";
       coach2          jasonalintonsql    false    315    4044    307                       2606    69453 !   Repeat Repeat_idEndIteration_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Repeat"
    ADD CONSTRAINT "Repeat_idEndIteration_fkey" FOREIGN KEY ("idEndIteration") REFERENCES coach2."Time"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 O   ALTER TABLE ONLY coach2."Repeat" DROP CONSTRAINT "Repeat_idEndIteration_fkey";
       coach2          jasonalintonsql    false    4036    299    307                       2606    69338    Repeat Repeat_idEndRepeat_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Repeat"
    ADD CONSTRAINT "Repeat_idEndRepeat_fkey" FOREIGN KEY ("idEndRepeat") REFERENCES coach2."Time"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 L   ALTER TABLE ONLY coach2."Repeat" DROP CONSTRAINT "Repeat_idEndRepeat_fkey";
       coach2          jasonalintonsql    false    4036    307    299                       2606    99403 "   Repeat Repeat_idRoutineRepeat_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Repeat"
    ADD CONSTRAINT "Repeat_idRoutineRepeat_fkey" FOREIGN KEY ("idRoutineRepeat") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 P   ALTER TABLE ONLY coach2."Repeat" DROP CONSTRAINT "Repeat_idRoutineRepeat_fkey";
       coach2          jasonalintonsql    false    307    307    4044                       2606    69448 #   Repeat Repeat_idStartIteration_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Repeat"
    ADD CONSTRAINT "Repeat_idStartIteration_fkey" FOREIGN KEY ("idStartIteration") REFERENCES coach2."Time"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 Q   ALTER TABLE ONLY coach2."Repeat" DROP CONSTRAINT "Repeat_idStartIteration_fkey";
       coach2          jasonalintonsql    false    4036    307    299                       2606    69333     Repeat Repeat_idStartRepeat_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Repeat"
    ADD CONSTRAINT "Repeat_idStartRepeat_fkey" FOREIGN KEY ("idStartRepeat") REFERENCES coach2."Time"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 N   ALTER TABLE ONLY coach2."Repeat" DROP CONSTRAINT "Repeat_idStartRepeat_fkey";
       coach2          jasonalintonsql    false    4036    307    299                       2606    185798    Repeat Repeat_idTimeframe_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Repeat"
    ADD CONSTRAINT "Repeat_idTimeframe_fkey" FOREIGN KEY ("idTimeframe") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 L   ALTER TABLE ONLY coach2."Repeat" DROP CONSTRAINT "Repeat_idTimeframe_fkey";
       coach2          jasonalintonsql    false    4034    307    297                       2606    185793    Repeat Repeat_idType_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Repeat"
    ADD CONSTRAINT "Repeat_idType_fkey" FOREIGN KEY ("idType") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY coach2."Repeat" DROP CONSTRAINT "Repeat_idType_fkey";
       coach2          jasonalintonsql    false    297    4034    307            +           2606    185838 C   RoutineTodo_Iteration RoutineTodo_Iteration_idRoutineIteration_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."RoutineTodo_Iteration"
    ADD CONSTRAINT "RoutineTodo_Iteration_idRoutineIteration_fkey" FOREIGN KEY ("idRoutineIteration") REFERENCES coach2."Iteration"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 q   ALTER TABLE ONLY coach2."RoutineTodo_Iteration" DROP CONSTRAINT "RoutineTodo_Iteration_idRoutineIteration_fkey";
       coach2          jasonalintonsql    false    318    375    4056                       2606    185833 +   Routine_Repeat Routine_Repeat_idRepeat_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Routine_Repeat"
    ADD CONSTRAINT "Routine_Repeat_idRepeat_fkey" FOREIGN KEY ("idRepeat") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 Y   ALTER TABLE ONLY coach2."Routine_Repeat" DROP CONSTRAINT "Routine_Repeat_idRepeat_fkey";
       coach2          jasonalintonsql    false    307    4044    313                       2606    185828 ,   Routine_Repeat Routine_Repeat_idRoutine_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Routine_Repeat"
    ADD CONSTRAINT "Routine_Repeat_idRoutine_fkey" FOREIGN KEY ("idRoutine") REFERENCES coach2."Routine"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 Z   ALTER TABLE ONLY coach2."Routine_Repeat" DROP CONSTRAINT "Routine_Repeat_idRoutine_fkey";
       coach2          jasonalintonsql    false    4012    284    313            	           2606    69313 0   Routine_TimePair Routine_TimePair_idEndTime_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Routine_TimePair"
    ADD CONSTRAINT "Routine_TimePair_idEndTime_fkey" FOREIGN KEY ("idEndTime") REFERENCES coach2."Time"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 ^   ALTER TABLE ONLY coach2."Routine_TimePair" DROP CONSTRAINT "Routine_TimePair_idEndTime_fkey";
       coach2          jasonalintonsql    false    4036    305    299            
           2606    185783 0   Routine_TimePair Routine_TimePair_idRoutine_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Routine_TimePair"
    ADD CONSTRAINT "Routine_TimePair_idRoutine_fkey" FOREIGN KEY ("idRoutine") REFERENCES coach2."Routine"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 ^   ALTER TABLE ONLY coach2."Routine_TimePair" DROP CONSTRAINT "Routine_TimePair_idRoutine_fkey";
       coach2          jasonalintonsql    false    284    4012    305                       2606    69308 2   Routine_TimePair Routine_TimePair_idStartTime_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Routine_TimePair"
    ADD CONSTRAINT "Routine_TimePair_idStartTime_fkey" FOREIGN KEY ("idStartTime") REFERENCES coach2."Time"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 `   ALTER TABLE ONLY coach2."Routine_TimePair" DROP CONSTRAINT "Routine_TimePair_idStartTime_fkey";
       coach2          jasonalintonsql    false    4036    305    299                       2606    185788 1   Routine_TimePair Routine_TimePair_idTimeType_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Routine_TimePair"
    ADD CONSTRAINT "Routine_TimePair_idTimeType_fkey" FOREIGN KEY ("idTimeType") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 _   ALTER TABLE ONLY coach2."Routine_TimePair" DROP CONSTRAINT "Routine_TimePair_idTimeType_fkey";
       coach2          jasonalintonsql    false    297    4034    305            �           2606    185748    Time Time_idEndpoint_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Time"
    ADD CONSTRAINT "Time_idEndpoint_fkey" FOREIGN KEY ("idEndpoint") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 G   ALTER TABLE ONLY coach2."Time" DROP CONSTRAINT "Time_idEndpoint_fkey";
       coach2          jasonalintonsql    false    299    4034    297            �           2606    185758    Time Time_idFlexibility_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Time"
    ADD CONSTRAINT "Time_idFlexibility_fkey" FOREIGN KEY ("idFlexibility") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 J   ALTER TABLE ONLY coach2."Time" DROP CONSTRAINT "Time_idFlexibility_fkey";
       coach2          jasonalintonsql    false    299    4034    297            �           2606    185753    Time Time_idMoment_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Time"
    ADD CONSTRAINT "Time_idMoment_fkey" FOREIGN KEY ("idMoment") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY coach2."Time" DROP CONSTRAINT "Time_idMoment_fkey";
       coach2          jasonalintonsql    false    299    4034    297                        2606    185743    Time Time_idType_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Time"
    ADD CONSTRAINT "Time_idType_fkey" FOREIGN KEY ("idType") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 C   ALTER TABLE ONLY coach2."Time" DROP CONSTRAINT "Time_idType_fkey";
       coach2          jasonalintonsql    false    297    4034    299                       2606    185823 %   Todo_Repeat Todo_Repeat_idRepeat_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Todo_Repeat"
    ADD CONSTRAINT "Todo_Repeat_idRepeat_fkey" FOREIGN KEY ("idRepeat") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 S   ALTER TABLE ONLY coach2."Todo_Repeat" DROP CONSTRAINT "Todo_Repeat_idRepeat_fkey";
       coach2          jasonalintonsql    false    307    311    4044                       2606    185818 #   Todo_Repeat Todo_Repeat_idTodo_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Todo_Repeat"
    ADD CONSTRAINT "Todo_Repeat_idTodo_fkey" FOREIGN KEY ("idTodo") REFERENCES coach2."Todo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 Q   ALTER TABLE ONLY coach2."Todo_Repeat" DROP CONSTRAINT "Todo_Repeat_idTodo_fkey";
       coach2          jasonalintonsql    false    282    311    4010                       2606    69293 *   Todo_TimePair Todo_TimePair_idEndTime_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Todo_TimePair"
    ADD CONSTRAINT "Todo_TimePair_idEndTime_fkey" FOREIGN KEY ("idEndTime") REFERENCES coach2."Time"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 X   ALTER TABLE ONLY coach2."Todo_TimePair" DROP CONSTRAINT "Todo_TimePair_idEndTime_fkey";
       coach2          jasonalintonsql    false    299    4036    303                       2606    69288 ,   Todo_TimePair Todo_TimePair_idStartTime_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Todo_TimePair"
    ADD CONSTRAINT "Todo_TimePair_idStartTime_fkey" FOREIGN KEY ("idStartTime") REFERENCES coach2."Time"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 Z   ALTER TABLE ONLY coach2."Todo_TimePair" DROP CONSTRAINT "Todo_TimePair_idStartTime_fkey";
       coach2          jasonalintonsql    false    299    303    4036                       2606    185778 +   Todo_TimePair Todo_TimePair_idTimeType_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Todo_TimePair"
    ADD CONSTRAINT "Todo_TimePair_idTimeType_fkey" FOREIGN KEY ("idTimeType") REFERENCES coach2."Type"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 Y   ALTER TABLE ONLY coach2."Todo_TimePair" DROP CONSTRAINT "Todo_TimePair_idTimeType_fkey";
       coach2          jasonalintonsql    false    297    4034    303                       2606    185773 '   Todo_TimePair Todo_TimePair_idTodo_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."Todo_TimePair"
    ADD CONSTRAINT "Todo_TimePair_idTodo_fkey" FOREIGN KEY ("idTodo") REFERENCES coach2."Todo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 U   ALTER TABLE ONLY coach2."Todo_TimePair" DROP CONSTRAINT "Todo_TimePair_idTodo_fkey";
       coach2          jasonalintonsql    false    282    4010    303            ,           2606    185843     _BlurbToGoal _BlurbToGoal_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_BlurbToGoal"
    ADD CONSTRAINT "_BlurbToGoal_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Blurb"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY coach2."_BlurbToGoal" DROP CONSTRAINT "_BlurbToGoal_A_fkey";
       coach2          jasonalintonsql    false    4069    479    480            -           2606    185848     _BlurbToGoal _BlurbToGoal_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_BlurbToGoal"
    ADD CONSTRAINT "_BlurbToGoal_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Goal"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 N   ALTER TABLE ONLY coach2."_BlurbToGoal" DROP CONSTRAINT "_BlurbToGoal_B_fkey";
       coach2          jasonalintonsql    false    280    480    4008            %           2606    69588 *   _EventToIteration _EventToIteration_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_EventToIteration"
    ADD CONSTRAINT "_EventToIteration_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 X   ALTER TABLE ONLY coach2."_EventToIteration" DROP CONSTRAINT "_EventToIteration_A_fkey";
       coach2          jasonalintonsql    false    321    4058    320            &           2606    69593 *   _EventToIteration _EventToIteration_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_EventToIteration"
    ADD CONSTRAINT "_EventToIteration_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Iteration"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 X   ALTER TABLE ONLY coach2."_EventToIteration" DROP CONSTRAINT "_EventToIteration_B_fkey";
       coach2          jasonalintonsql    false    318    4056    321            �           2606    68996    _GoalFamily _GoalFamily_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_GoalFamily"
    ADD CONSTRAINT "_GoalFamily_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Goal"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 L   ALTER TABLE ONLY coach2."_GoalFamily" DROP CONSTRAINT "_GoalFamily_A_fkey";
       coach2          jasonalintonsql    false    4008    285    280            �           2606    69001    _GoalFamily _GoalFamily_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_GoalFamily"
    ADD CONSTRAINT "_GoalFamily_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Goal"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 L   ALTER TABLE ONLY coach2."_GoalFamily" DROP CONSTRAINT "_GoalFamily_B_fkey";
       coach2          jasonalintonsql    false    280    4008    285            �           2606    69084 "   _GoalToMetric _GoalToMetric_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_GoalToMetric"
    ADD CONSTRAINT "_GoalToMetric_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Goal"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY coach2."_GoalToMetric" DROP CONSTRAINT "_GoalToMetric_A_fkey";
       coach2          jasonalintonsql    false    293    280    4008            �           2606    69089 "   _GoalToMetric _GoalToMetric_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_GoalToMetric"
    ADD CONSTRAINT "_GoalToMetric_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Metric"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY coach2."_GoalToMetric" DROP CONSTRAINT "_GoalToMetric_B_fkey";
       coach2          jasonalintonsql    false    293    292    4026            '           2606    69608 "   _GoalToRepeat _GoalToRepeat_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_GoalToRepeat"
    ADD CONSTRAINT "_GoalToRepeat_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Goal"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY coach2."_GoalToRepeat" DROP CONSTRAINT "_GoalToRepeat_A_fkey";
       coach2          jasonalintonsql    false    280    322    4008            (           2606    69613 "   _GoalToRepeat _GoalToRepeat_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_GoalToRepeat"
    ADD CONSTRAINT "_GoalToRepeat_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY coach2."_GoalToRepeat" DROP CONSTRAINT "_GoalToRepeat_B_fkey";
       coach2          jasonalintonsql    false    4044    307    322            �           2606    69016 $   _GoalToRoutine _GoalToRoutine_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_GoalToRoutine"
    ADD CONSTRAINT "_GoalToRoutine_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Goal"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY coach2."_GoalToRoutine" DROP CONSTRAINT "_GoalToRoutine_A_fkey";
       coach2          jasonalintonsql    false    287    4008    280            �           2606    69021 $   _GoalToRoutine _GoalToRoutine_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_GoalToRoutine"
    ADD CONSTRAINT "_GoalToRoutine_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Routine"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY coach2."_GoalToRoutine" DROP CONSTRAINT "_GoalToRoutine_B_fkey";
       coach2          jasonalintonsql    false    287    4012    284            �           2606    69006    _GoalToTodo _GoalToTodo_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_GoalToTodo"
    ADD CONSTRAINT "_GoalToTodo_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Goal"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 L   ALTER TABLE ONLY coach2."_GoalToTodo" DROP CONSTRAINT "_GoalToTodo_A_fkey";
       coach2          jasonalintonsql    false    280    286    4008            �           2606    69011    _GoalToTodo _GoalToTodo_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_GoalToTodo"
    ADD CONSTRAINT "_GoalToTodo_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Todo"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 L   ALTER TABLE ONLY coach2."_GoalToTodo" DROP CONSTRAINT "_GoalToTodo_B_fkey";
       coach2          jasonalintonsql    false    4010    286    282            �           2606    69104 (   _MetricToRoutine _MetricToRoutine_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_MetricToRoutine"
    ADD CONSTRAINT "_MetricToRoutine_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Metric"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 V   ALTER TABLE ONLY coach2."_MetricToRoutine" DROP CONSTRAINT "_MetricToRoutine_A_fkey";
       coach2          jasonalintonsql    false    4026    292    295            �           2606    69109 (   _MetricToRoutine _MetricToRoutine_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_MetricToRoutine"
    ADD CONSTRAINT "_MetricToRoutine_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Routine"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 V   ALTER TABLE ONLY coach2."_MetricToRoutine" DROP CONSTRAINT "_MetricToRoutine_B_fkey";
       coach2          jasonalintonsql    false    4012    284    295            �           2606    69094 "   _MetricToTodo _MetricToTodo_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_MetricToTodo"
    ADD CONSTRAINT "_MetricToTodo_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Metric"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY coach2."_MetricToTodo" DROP CONSTRAINT "_MetricToTodo_A_fkey";
       coach2          jasonalintonsql    false    4026    294    292            �           2606    69099 "   _MetricToTodo _MetricToTodo_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_MetricToTodo"
    ADD CONSTRAINT "_MetricToTodo_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Todo"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY coach2."_MetricToTodo" DROP CONSTRAINT "_MetricToTodo_B_fkey";
       coach2          jasonalintonsql    false    294    4010    282            )           2606    69618 (   _RepeatToRoutine _RepeatToRoutine_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_RepeatToRoutine"
    ADD CONSTRAINT "_RepeatToRoutine_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 V   ALTER TABLE ONLY coach2."_RepeatToRoutine" DROP CONSTRAINT "_RepeatToRoutine_A_fkey";
       coach2          jasonalintonsql    false    323    307    4044            *           2606    69623 (   _RepeatToRoutine _RepeatToRoutine_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_RepeatToRoutine"
    ADD CONSTRAINT "_RepeatToRoutine_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Routine"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 V   ALTER TABLE ONLY coach2."_RepeatToRoutine" DROP CONSTRAINT "_RepeatToRoutine_B_fkey";
       coach2          jasonalintonsql    false    284    4012    323                       2606    69498 "   _RepeatToTodo _RepeatToTodo_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_RepeatToTodo"
    ADD CONSTRAINT "_RepeatToTodo_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Repeat"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY coach2."_RepeatToTodo" DROP CONSTRAINT "_RepeatToTodo_A_fkey";
       coach2          jasonalintonsql    false    4044    307    316                       2606    69503 "   _RepeatToTodo _RepeatToTodo_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_RepeatToTodo"
    ADD CONSTRAINT "_RepeatToTodo_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Todo"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 P   ALTER TABLE ONLY coach2."_RepeatToTodo" DROP CONSTRAINT "_RepeatToTodo_B_fkey";
       coach2          jasonalintonsql    false    4010    282    316            �           2606    69046 $   _RoutineFamily _RoutineFamily_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_RoutineFamily"
    ADD CONSTRAINT "_RoutineFamily_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Routine"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY coach2."_RoutineFamily" DROP CONSTRAINT "_RoutineFamily_A_fkey";
       coach2          jasonalintonsql    false    4012    284    290            �           2606    69051 $   _RoutineFamily _RoutineFamily_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_RoutineFamily"
    ADD CONSTRAINT "_RoutineFamily_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Routine"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY coach2."_RoutineFamily" DROP CONSTRAINT "_RoutineFamily_B_fkey";
       coach2          jasonalintonsql    false    4012    290    284            �           2606    69036 $   _RoutineToTodo _RoutineToTodo_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_RoutineToTodo"
    ADD CONSTRAINT "_RoutineToTodo_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Routine"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY coach2."_RoutineToTodo" DROP CONSTRAINT "_RoutineToTodo_A_fkey";
       coach2          jasonalintonsql    false    289    4012    284            �           2606    69041 $   _RoutineToTodo _RoutineToTodo_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_RoutineToTodo"
    ADD CONSTRAINT "_RoutineToTodo_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Todo"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 R   ALTER TABLE ONLY coach2."_RoutineToTodo" DROP CONSTRAINT "_RoutineToTodo_B_fkey";
       coach2          jasonalintonsql    false    4010    282    289            �           2606    69026    _TodoFamily _TodoFamily_A_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_TodoFamily"
    ADD CONSTRAINT "_TodoFamily_A_fkey" FOREIGN KEY ("A") REFERENCES coach2."Todo"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 L   ALTER TABLE ONLY coach2."_TodoFamily" DROP CONSTRAINT "_TodoFamily_A_fkey";
       coach2          jasonalintonsql    false    4010    288    282            �           2606    69031    _TodoFamily _TodoFamily_B_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY coach2."_TodoFamily"
    ADD CONSTRAINT "_TodoFamily_B_fkey" FOREIGN KEY ("B") REFERENCES coach2."Todo"(id) ON UPDATE CASCADE ON DELETE CASCADE;
 L   ALTER TABLE ONLY coach2."_TodoFamily" DROP CONSTRAINT "_TodoFamily_B_fkey";
       coach2          jasonalintonsql    false    282    4010    288            �      x������ � �      �      x������6r�ϣ���D�
���ރ/{ً���U��86����$�g�U�l�b�3��_��@���߿��ן�������o?���O�u��/�$����X��[�R��&���f7��}َ�1��\��PD�!&����#�r�4��i�=��O����%Ch�!�K7�!������>D�!*1r!�Fo���Mq!f2D�!�a8�-!����x�w�s��;�"�C����7R�!���X���!V	����(�V����	�a���f����I�U*H���k;h"���K��%�D�Zi/�	%h�j4��J�	*J�	l�^*�(J0	:��ұG�3�?���2p��-�`*M�2q����	,�\LA4�HP�s$�4D�� �QxE�{ �=�	�RI'0� �C{��ߠ�%H���a��@z����s�%�4H�mL��)��	 ��>N��G��$	 �B�'I젿^^$�؄>N��;��&H ��6�U��1���'p،��I�����	 �Ɵ��C�*>.�	@l���I�?�a~\^$���{`7]p7}$��&ő�w�w�G���'�I������#A�.�It�n�����%�L�W�As�n�����5A����ӝ$��.��>D�F�D'	���{����wRwRg��}�f�I�n��3��>��8ݓ(�e�2�y�6�=�4��� ��%��w�w�g����
÷
��*��:D���褊���eKq�>��*�#V�G�-A�Yi�䤊���w-�@)�Tq/��^�l	"N�4pRŽ�
{��%�8m�Tq/��^�l	"������K���([��� 9��^b��D�n3�}ly�Tq/��^�l�ӟ~��?~{3��ͨԽ3��%��r>.����6SW@�8�ʖ�P�X������5CIe�?���u��0BA$!��p�� (CMe���T*�PQMe�|\��J�	%�L�A:�����2�T�B�� ���P��� ���^+�eHA���R0"BdI!r�Q�U*�!RR�d�y�#R"%������%���HI1r���U�HA��#'��^%���HI1r�ZI0%QRR���S��� JJ�����!H�))�����4�<xI0%QRR��d�}�sR'%����A�IA��)NN· U�Ɋ8Y�Խ~ �^��9Y'k���y$�r� ��� A�ݧ��g@�~\^3$(���U�tt8"uMPr7"�oQ�clf@��	J�F�Q:n΀H]�܍�EI���`Dꚠ�n4��0��H���fHPR?
x���_pѯ	J�F��|U���K~M1�p:OX�.�5��B#�$��\�k���GFIp�/���%�����_pͯ)J2$%�U��_S�,dP2J��~�U��()件(	��W����^��?�����%�LUDIp�/��%Ei��$�u���R���|�u���R���|�u���R��{�{�u���R��{�{�u���R���M:Ip�/��'+�>J��~�u��8Yɗ�Q\���-�ɪ��t��_p�o)NV^]�0��9	����d��^�8��f���l)N�����Ӻ�W�-��:��x�*�6+�6[��J>=�R��f��fKqR����Tq�Yq��R�T6����͊�͖�$|xU*�5+�5[���f�Tq�Yq���/�[�z��&����VV�_˷Z���4q�	R�������^)�Z�o�A����ƫ�����t}Y;s/�^����������Պ�Y/R�k]Z���,�|���e�f@K]���/Nt�{�
^�Zֵ����@�Vl�{�
^�Z�Ů���W@�Vlfk�
^�Z�jW�In���L͂�ٓԤsߋT05��HRs4��I07qs$�9�J�U�MA�In>J$���͑���uh�sS�InN^�I09�s$�9�R�ULNA�IrN��a��S9G����;�%��DΑ$��ݬ 	f� v�$;'�I�$����9��d9�*���|�R��i�Ki����e�"��݊��A:T��R�ع[���+��x���L�sw2��
��=^��2S�ܭ����o!���ȹ[��w����@��)r�V�TeA�͋�m^�)r���ev�[�>/2S�ܭX�$�#G�"�nU�;�$�#G�$'+��"x�`Ye�̐�f!��$x�`Yi�L��fa�z��1��ӫ��,H�G��ۏ��Jx#"��c���g�$9�L�-3Ř�h̠nIr
��$H�����Ir
��$H���U��Ir�Q~;I������$�Ig�-��Q���$�)웒 	58jPK����� 	5XVf?S$�I�m�7��D��$�Y���N<j���~�H���z=H�G�u��Iv�΅�[�1�e��3C����8;�8�S r�$9+[{$�c�jI���%�Q<f��\��$9)+��)"Ųr�� IMe����tY��L����e�A��>]V�?S$���R�Iק�*�g�$5�<��ydD�
��z�;���Iᤊ��
��z�=�j�Iᤊ��eM�3E���+ 'U\�.���)�n�q��/�E�a3�g5N�7V�����*o��x�i[�|�tw�Z�n�l��^Jl!P���4�� wa�[��v;�`3Mॣܛ߬�]�\~&x����)M���C	%x��F��������L#��IG��t���f�F:Mॣ�C	J�v3�`S�oॣ�	��k��D�m��^:
�@P��Q�(bP�
h��n(�$��h�	"�N[� 	�� h���y$�wAD�m�N:��P��$�(�� H��Hp\^$�(B�� Ũ�x�	&J�<p��EӒ�qyM�`�(�^%=�� ��	&�Q8I�%�oc���$=�� �Ζ`"o_=��fKQ�����g�%@<�m���gw$(�M����7��4(j�-A�*�N�sr%@m�%�X9����+�[����:�~��~�%xX���NR�KU�K�k���~@	P�l	ƥ(L�s�$�2�뤽T')�+��@=`O]qO�%�����$ŽTŽ��g�῁�� ������g��0�k�������'�D�*9Iq?]q?��I6��W�NR�OW�O�M�����R_<.�	D�F���
����k���d�p/�p/��Y6��?���#�#�?�&��	� �#�?�&�L�&�Jvڢ�Mx�����>N�s�$(�]|�M��xN2�K6�K~�M��}T'�%�%�?�&�TZ,9�p/�p/�_�X|1�N{HP�+���_��F�}X%�7M�{��~����ۆU�{�T�7M뺃Q�����po�:.�u#�SZ�c���귬�o.�u��/�Р�2\��F�/�Р�2\��FFߋ �Рe�X���^:6�A:�p��;�:r��MhP��2�8��0�tlB�2L�!�I�ұ	�ඬ��!�ɉ�5V�؄e( �Lq�HE�J�&4(��)N�iWI0'qr�8id��sR'g��V���`N
��Lq��u�"���(9S�4Rۮ�`J
��LQ����*	�� J�%y�����șb�5\W�RŌ���3�H��g�RŌ�����9�{�*�ok���5C���3r�q�qZ��A�3��k'�1�3 N�b�;�tNA���{U��Px��3 N?.�R�lB�qN:�!a@j�R�ld�2J�T$� H�[����7N:'#a@j�:
')���b����R�ld(0Jz� C�֫�p���>���iY�q��(�`DF��tN����Wg�D#�j')����zuN0������
�~�:'�v��v��
�~�:'��L����WX���i8ш��ӿ�����׫�p�Q���$�u�º_�N�	F�>NR\�+����<�hD�M')����zuN0"��QR\�+����<�`�kM')����zuN0��f��&����zuN4�}')����zuN0�E����
�~�:'��ݢ���WX���y8���Mv����V�zuN4�� �  C���$����<�`4��0��9�j�:'�om����WX���y8�h�d��6\w_���h{�$�u����<�`$��t���p�}u"N0�|DI�U��y8ч���d��6\u_����ؤ�W݆���p��t���p�}uN0�?��#��W��D�7�w0bd�\w�j5>�����}�s��Ք��뮃��^$��β���r�u���֋��Y>S\��V�����0X��z��::�6��������l����3����`E�Y^�c��BQ�˵�������e�0��r�u�"MGT�=vP��2\���N�g�H�;(EG).��V�_�H�;(�@)��l�g�H�;(�),�Ͷ��"H�; E����"��Vh�c����In6��\�c��BP�$9Y���MKr��/	WI07qӒ�lJ�� 	� nZ����{�%��DNK��q|I09�Ӓ�ld׈ULNA�,9�7�$����ٲ��7$~�2T�͖�&oO�T17+�f�rs��ρ���g�$7;��6H�g 0�wK����,�t~ S ~�$9�H�#�������"I���+��c ��%��Y���s �����`���a,qC�^8?S$�9�;2�;���,r~��>C'X�ޞ�Ώ`
���St����B�oQ�5.ey�H�s�'����ק�+�uz��O`
���St����1�e��3E����ߢ����\������k�1;�AO�sp�Op8j�x����`�	><�ᨁ�Q��t�������f'5�>I'Z�-')5X��?S$�97zG��x�`Y�L�d�d� I���D��"�N�X���,�����+� )5P<jp}�N�"[T�����䄣���+�EE��,�<S$�9ٷ�AR<j�l�L�$�������G���)���;� )5X�x��>G'X��� )5X�x�Ȓ��w?ਁ�Q��St^�����;�p�n�^�>E'Z�7$H���eS�g�9w+V��p��l��L�"�n%����#����
�)rV����z}�b�"E�݊�=�p��l��L�"�nE6X���z�p�~}�N���67V�v}�Nt�����@�\6�8RȬ�ӿ������׿�c�?�J���y�����-��)����q��^'�AR����?��#�A2�o�_������-�a����m�Z��:���_n����4��@������%������m����t�Y��qy����Z���9�_���_������X��W���;�f ���c^���?�ϟ�3��Wo����O��#�>./�v���c��I�Y��k��g�Nz�_ �_��?;��'���c��#��m�Y����#�>.����g���N�g��V ���k���Nz�S ���k���*���_��+�v��?�?� ��m��Nￓ����n�����@�~�6��Ikl��<�G�k���y��I����nӯ+��;�1�����m�u~�{���~ѯݦ_������+�~�6��F����i ����n�o���'�~�6�->^}*hv��f��O��O�����6������c��ڻߦ��O�O����m���7�_\��ފk�~�~Si��I�koŵw�M�����$ŵ��ڻߦ����$ŵ��ڻߤ_��6�����[q��o�o7�//}/õ��ڷߤ�n���$õ��ڷ���q�{�p�k���7�wC����G�{\^��M�G�Q'�}׾�&������$õ���w���q�}�Jx��׾�&��c��}s6�~�+�q�~ǑO��=���W��6���������p�;n�O�>�N2\��|�m�	k}�d��5\������������M?�xL?X�����3A2\��}�m�U����1�`�;oӯ*���p�k�����waM���?�}׾�6�*�y����p�;o���u��w�f��^'�{׽�6��CD�um�|W�s|����������|.�[J��o��?��%�Ϗ�}Op�{�y?A����J K��m["�\��T���O��WIqE	$��Ϳ�����O�闿}��?�/D�������2�/ֿ����n����<
�
#�����d
3��K�=����=�%St�)��8�cM�����h���J�H��=��y{��L� �<��X3�'~���~��k	�      �   `  x��Zˮ��]S_��"�����cvWr,�e��-��3�3C_9 9w0�f��,d�}>"��OHU��n�M�N��Ҝꮮ:u�{�
��y��W�V�͊�;+�U���_��S��(�ca|E�JD���U�I�1E�Z�t�T�R�1�?�R�����B�dW�� N��n��&�ls�EU�SV������Oџ+%C)�χL�Q��I���f�F�Mu�Uu�����'�a	�zŒ�2��X2���Z��>e�5ӕ��0wɂ�tEE�Ht�a�2x�7��lu��K]��	 a�[N��Bw&��	�@�"��I�/tV����TW�z!���k"���c/j�b,d,񠺦U&�gy�7�� ,�..�,�(P���:��C��+IC�T,��׺�$8�r��J�u�wy�o�aJW��$��n�=�!�j��䒕-�����"/��`0���h�uAڃ&�s�o�B�l������}��ȡjI^�]]|�3�(�m�'N\`0$[�8��|��iR|Zg����s��&�J���0��}C����f��!W4U�F,��p`<
���8h�/���q;�*���ζ�<��l�����q�����(��Eh���A��E�5��+&�DI��ߜ�Y�I��3T��^ Vp�m;�`��p��)[p��&������l����O���G]��bN=�>�@n��ܧ�đ4�� �YC�4n�����4�����#ܗ�qBv	�b��8��i�%X+J�B&T�Q�)��oIl�{�*h�I�M��CO���ss��sI�� ��~����`"�t��	gB�=��E�e��P�yV@�9!rQ�~�xxpd��������<�������Ӫ��%ͱz�8�>'T�tM$S�G_]J�]u�!5���#������d�K?t�CΥg����u�t�|������R�w�dw!��`����,�fM��B���0���W����_%����>/Z?����J�aJ�d��q�N��6P��7������T�IdfT#@i��𘬏$x�=�&Q�B�k�������*�S�E��
:aI=�m!��R��z�M�r|u6}uJu}%	�@�W\��\3e@A,;���|��|_U��d�dE����@I8u{�0L�$�r�Hv��w������}��F`�����^9o��z���=�&�42d�$y����n	�~�&1C���
��˦�9���
*
=_�q��E�D �M��0�NN�{G[秧"��n�k�ĤiA<2�lޑI�Lc�mNLv-I�&�3b�>Ьd[�B���k<T�YEwx
��P�>W�ip%h�y�9o�nΞ����4N�ÎL�������8B��J���o0Yhn��Ϗ���G�T��,�p�<�u_4P!(�/P�^?&�RI��d���u]m�P���VW��`"i�q﫬��X����5Y/*xs�[Pﰝ��-���jX�\���6d����`@����?]^�ѬL͸`b����f��NEV�`���kUf�P�jID={t-<�չ��'��q3sa��#�,��'�G&;����9/�0P~솀"ý4��D � �}^{v&�Q��Y�&&��a��#�d���7q������i�i�3�{P�0sˑ����SEEr\�<52<#��L���1j�b��w�N�9a� �����EA��S���}��
�~�dC��7!��ϛata�b�CC��}��d��Nĝ`�L���8/��+�z������C�f��duo��^H�|S��;�/�A����,�t�Kgb���g����K�m��{���|:w��U��M�@�i�0��	5'�$�a��:�fN؛�r����#������2lL%*�k ���0qUD�=arMxDǍ�*�E���l�����p5�U���6R�e���uV�b��P^ܔ���4�)r01����w��7���=�wf��g���&⮢8�l�L֪0'�0�$L��ڙb��q��h�|�������곷dS�6�gA?���Q�r��Hy���)���c�� �{��&��=��(��C�ݭ&L�;xKC����ߔ��lӍƱR�p���w *����]g�&{ ����}I�J39�&�2����5��B�wת��_��%��35TK�ǰq�ZW|`ɗ��T�c`���H�1$���P�Hz!O�3���3���QosL�8�E~z������=�,Y���l�oj9[#c�C�Vg��"�>�wM\��7�����_,�T͡G&-m΀<���x��yS^�a^����L_y�OyVV�Aiz�~d��}�1S�%��҅�1��d�c���
9�0�5,~	[��0�k���3�ljM�����~��ՋN�2J��H���{�x��O���5Y�7����Z�+�Ss�L��-�'P%�>�U����[��ٳבɲ���\����PU��t���2{�t��/��5ȉZ7����KA�<_���+<��=��$���]���!/
�	�7��yM֓�Kvm���l)\'&���d�%�6H�v�Q�0Ǘ'�!wWM��A�5Yx���:4�����?�D��O�dAa��	|���~]Ӏ��ȶ6��EM�=JyW�,*t�_����)�U/r���|AuM9
i�xa��J<�n������wb����� �1�.;9e�l�v�S:���:K��![�ű������d�&^T /�j��(���'u	5�Ɍ���0��	���;�8�@e���2[��D����ޘ�[�c2�Q�%�dJQ�����<�i��kV�8�<{'&�~	8�Zp?�5Yp�+�~��%d�(|�vMY�ˠu��g�_�U�f�o(��	�fh�nQ�5^�{��`rd�YÚ��;g8�HAйŬ��#��*dn�a�ٟ���K�;�&��x.q�F�l�\"���:f=���e&��)5#���.f���D������.4�h��91Y����Ub?�.@��6���hFol�G��A�y4Bj��$�}arM0�/~֨�@�¸���j��=�8� ��z�W�{�kfuFE�Șu��ǂ|0��e����0"�Jߪ]����\Ճ��x�%�s�#D��nbr�.ڶu^z.	�a|��K��L.�<�� ��Ac�Ed4xkjsג��ŀ�g�M��0x�����r"[_�	װ�f@���f���00Wyw�G���C]��na�i�R���'��p!�����Q�-r|&eU��#'��ʛ��ܿP�IБ�q������9�{��7��j�|���6���l>lOL����~Ｇ{�JP|^�|+gbr��d0=`��}�62YLN;̃Ί��=a|�JB��Pkr*������?���?�]GB�w��۶ ����������I�(6=b~����f���0�p�7��R�ܘ+��r�N�07��+���KS!��S�����((�XL�R�����zP ʳa�b��ɽ|�-p��4I�$+��k4Db�~�%��`P�T2ц�7iF=�>�Id�4#�$r��k9�+���Wj��0�%�qc��?ñCI�|�dFR(����n���~�>|���	�f      �      x������ � �      �   }   x�}��C!�v4 Z��Z�%�S���4�Y!q� ��QR�VH�,b	M���F���S��{O���IESx��(6�xUb3�i/X��L�U�Q���TLb��()�}�1�U���ј�	M�2�      �      x������ � �      �      x���[�dGn&���a�0���3~��[s�%�Z6�-[ٚJɪ +Ū��̨fs�����qw����X�(�+2>���@+o�ݿ��r9�r9���_�_>=�?��<����rzy~�|z}|����������Ow��%�P�{��W�$⽑��L:���d�W�$ͽ�ZOJh̵5}ќ��/�,��ɺ��������~��w�<�\N����������ǧ�����"|�d�sV�3!����W{��ޘ{�'��.�v?U��"��;��Ww����p9�~}~�����ׯ��qzxy|~:������^O��ty��������K�i(>�-�秗4���y�z��K�~x�����ߚ��NR'���:4"RF!���u���nb�+q��Qw!|�Uw9_��<�~||�r~y=���r�����O��K��$�E��-���/��������ϗӏ�Ͽ��3�������i��v���]g}�ϓ���B�&��:Q���O�l�@������w^Dw��痧4}Oy�zy|:א��^�2ک�d���ҍ�^$mlty�m��f�!q5��3:�C�<���
��C���,��R�E:c�����F�M�e��08O� �~xHk�������7�R��P�͆E��dE������%��/O��O�ί��O�w��{%�cA̞�:�]o�pSvF%�NCD��N�<���z�`��(;x�}���__A�z2�rK&��^��Wye+P��G��� *�S�ف��ݿ=�N�)m���I����4S�����{��R�
VBJ袄�sX��T%B3��Ԕ�b��Q"8��"��9$�������i_��������4��aC�����C�f-�E$k���y	�g�7Nx��Rĝ�ĳ��0��H�VL:-���R���h�"uYD�j�bR!})b�P���K1��Ò�|������sii��A:w���M��6
ZU[ܴ�}R2���F��
�ZB�IJ�z���imJc�2��d�� �p z8B��Kj7f"��t�|o��N����<u�څ��b6�&ʼNG��R��"���i��E�&�@�i�&h��V��=��y"�6��b�|���`ϩ ϩA��;1��%�f�Z+�	V�J�f�]5�`ן�0Y�@�����Zko�ڏQk��R������4�y%o����z�i��B�����F�����$B}��O�D��(�V�֠�d'���L E�La7����I��^�u4k�����N<OcЂ)������OR)��J�c�EڲSL��'�����6r����U��K��~����������__^���������$�����1߾c7��^���W��E(��� �l[������SV��n�;��1�h�}���
i����/H<� xBTm$�m01t����ׂ��3��m�;��J�`1�Zrm���[cH<+�3���{���d�6��"fk��AMv�Qս�I��^�)��BZ)b��ډg-@�ɳ=T?�o�Ľ����SHE�		�	�Z���rt��RZ��m6����ɧ�a�H�����dg5�+�6Jw�U��[L<��z�|,�����5V.RM���yȗfɯ�{�ҙŪڽ�Z)b��I��Y�Tk���d&�|i���Z���|�>Q����'�o�l�����M��϶�[=�^P�S�NY勳d��X�7}+��ޮ�"��0t5k�c��;���SP�4���J��h��!z3	U��*�D~��F�z�k��a� � b#��:`���"�k���
4N�MI]m��e�O;�{'ᢳH#E/���?)�C��I	��q\T�w�ժܷC3p���^P�����Ͱ5QR���#DZ�*?BXs/Ť��{�X�R����E	�L,}�=�E:Y�FZ)b��)!��DS��b�UH��G�FZ)bȢw�Y�K�Ki�
��U%�N���<����d��E�V����"��L���^	�����p
p8�:*]ګ���o�:�r�^R��N��̷�$�S��?�i��\^�0:���!o�%u���'�����o������6p�����c�4q��!?��b��>������og��l�0b��!����w8/n��Q���������m�dx��`���(.�d��'�~�@�+NJ�1���L�I>��nW\��qY"�|5��ea\��%\���6.��.��D\�ݢ���߉3.��J��������3��0������_tFZtq7���f�4�kyé�y��Uj4�^K_W�ygS�\�m��p�m<-p�2�m��~ìF�o�fp�)`s����[��h�E�3̍�*��g2*�����ᩌ����Ou??@z��$���������M�̆��C;�N�=�|�X~�������_��FƋC�'�[SF=
����NR�y�JJ��1���H���
��P���
@�i�-
X����eh�PKw����]N���� �~?-�)hI���P&�� X��ps��@ֳ4 ,،��,�@auGqH\`As0�`y6,�����H��ؽ�f!q��{X�fu���[]�] �$��lg�sd!q�X4gp�=a�� ��W�E��m���U��� �)i� �W"�ډ,�wJ�����[y�[� �#iV>��l�WXyI��|��x�U6^�l�b�`�|+,��W���{�+$.� �H6^��v��1o�E��J2̓*/N���+��+��W�s��ٳ��3��x�X�d��
,r���� Z��V�lX��	�v����A���U=�c�z�7$~��ޝ5U"��??�r>=|����t�|~��~}�|<��KM3�Q�,�i4b�'��(U��Pآ�b�v��/�yʄ������*�h�G�u�U7o��=���۹��F�j�Y�.
<jJ
�dO���o����[t-��G������B0�9�{|A@Y3|��,���(K�zt����M�o!o鮳�NQBiS�[�����훍Z����u����|���t��N����Լ.��<M9�|�E:�������=��GҞ>?>}���tC�}��T���k��}X	"N_;�T��2L=���	����ӏ���'��0]�K f���Q��SO'�(U�2{�!���
s��|C�T�Y4��~V���707�xH��k�^�n�&~��ja�1�O��ɾ���c0�1�]~?H�{�[��8�ߙ�y'Ν	��1��a�50a��z�� �a�g[W=�w�ܛ�
҃v+�{�G��G� 0��W�_L;���u�).��ѽ�
�:�e��z���n�L9�Xoг"$~WHOs�o��BГ(�MB�h�6�>M��CZ)bv�6�R ka��� %>��q�s����>&��	$YI%r��&�l�\[ibH�ZhH��*�tƄ%�Xӽ|��J��8:������X�Ihx�9��7yG����@S0� m�A�������Դ��d�k��ى@��W�uh�()Lj����i�)ɷ�f� ᠻ��-��݇�C//�x�cи�h":��n��g�~�C��((3x��J�YIL��t�!�1t���c�)L�M�ܼ�Qz�B51��V����ĳ�w�$��a�"˔�A�R�qgJP��p�zl:P�����D�3	�Q�^�{�����QQ�R����E�g�ɛ3�
uB������{k'el�M�j%�����
̡ �.ܛ�UʒF��V��gϮ�"�]=F� W/�!��_��������'4��v�n�Y��㉺�27� ��n��V�ҧ:1~wi�(�Ӯꇗ��/?=�^p��O���0ɀ�)m��K���&�_��;v��Mf��5|�����\���������s�������cw�>GaB��8�&pO����b�i�l0���f^�z{a0q�M��8q�9�����DP��f'Ν��R�+p%�k06i�iƮ0B��	�`�]a�C�`���(G\���O8�D)%��zqٻts3�$.�&    o	�K���JO8�+���3������g7;N�Zoqj�ᔲ^-�{��'.�'�"&\B'��_&�����4�uԇ8C�ҟ�r��=g���ׇ��6��Mg���Eq�<|�E�P�pw�N�]��p��N�]���p�#ǶKcZr�N���N�s~� Q��q�N��t��g�ᐲm���Ρ���d�%���V�a�a�}(m�9�/o?������m7���6�c��=9Ǣ�6�c��w�p��m8Ǽ�c^yǵm8Ǽ�����X�ۆs�9�_EC�o�1g�4��P��3r�m�Ǣ�V�q�9�v�c�r�1o䘷���s�1oļ����`:#��9`��tG�i��`�݌�i�e��̡�8J<,�9x�i�B�O�����#�@��m�	jz�sJ��COq(С@�+P�N���=:��g=�Rov>?=�Ļ���A>�t����;�)�ڍT�t#g��o8{�n����f8qo6��������\>y���ԗ��R��(�yW��3N�������;rr��OO����CN��xy<4�v
��KV~�j��L�w3�d��5R��7ၷ�#��eMq����H����;���
*�����́\�%*���bA&yƾ���eUl���+�m�JC��N\�0 �+�<�S������>�oFoǟL��5Y5f�Q6�.���!n^[)b8�4� g!�m����"[�dyEN���2
i���L��x��["���	fo��g^�VZ6|�k+E��B���;C$'-L]��.E��6G(#�Hüa���cc4�[�]Uy&�wi׬�K�w�y��]���l��V�����]>��]g�%���q�3w
.�މgt��0tsw�wa�I6�`3U�v�3D3��^h�� 0���ѝxF�'K�\�2�*��/���f�2Y`���Ġx)�FG��f���k���]��8Y�>�P�J�Zt�Yp[����»\���)����3:�>Y��xp��ved5�W��3:�@%�O܎��԰1�s�}���]+E̦�W�6��������#�m�Δ�>�m�q?�Cf_Zib����|N�dr*���J��� N���������=��
�Z aImr�]	�>��J�z��>���z��R�8c̦�a��V	�B ��(����vi�8�4��S�=�d.����Αx(�ɪD>h���S�:�����V:�bH��4"��٣Z���,J˱����g�E����X��4�����\����������8�a������x�N�E���C��r/��IK����M�H�U���z���Õ�\{o����A=sSmzX�t�^��/��2T�q��j���u�`��ś���p�-c�7ڰq�Av,�H���c�=��7Tgg��t>=_���E<MZW��.t��V<���D�(��J J��\*p�w�ſ(�$G��]ś%x[�����[�[��<|J��HJ���*����ɒ����m���� ��J��w`ҷ��7f3�>��9z�I�3@�y��m���PN�E��1���Qc5�ڃv����᪁�.���3�jm0(9zozX�x����K����|���z��:=�����Ң�zx��� E����_������\ih{�ņ��o:6=ne�����va�<�)uŧ��
<b��r����f����o(9ꊏk�j�`����Ή�u�9_���m��×��k!	~~�����e~�����%X� �?� ��BIGǥǺ��N�߽v�ޔ)6G���3txQ��-}^�Ù'"�xS<�r��b⼭E8�i�fd��VtxZ��ތh�£ρ`~���-<G�g��vI7[x��Wӥ�ܮ"N�[�gۑD�5��4�E�;�lHt�L?��f�(kp��m�Y��^k���.���k�H1)c�/��J�3M�ӓJ�4���n�$��i�)q>�,�#*�g3M�p��Q�H�YL7�OX�v��T�dl����z���E�)b6��� T�zCẮ)��uN"�1{!6JD�-6�&�����Z)b6��U�lM*�pe&��)���"fә�k~ǡ>۩`-@��wq�w���z:o��LS�Fx��R�l�u�ǒ:٫D�{v�KN�i���Ġ8%���d���ގk��b�߉hl���k��d[�;P�۾�n��$n�^k�>��]T�͈�M�9A��^�wT�c5�fߊF�t��:Ok�I�f,���N:�߀���mد���&�8���=L�:}�2A�av�N����$Φ�A�nF�ηਾ�)�^�o�GVW'��6��v����K*_9��v���R%f�+�i�m��!�l��g�����ә�2�����)j�:"�v�lq�����v���kU�s��sС|�!��
.���LZ�(!j��u�v�,[bCL�e���r� Pph���V=g�8<g=
n�����L;��I�-*��
.��8.��Qb9��E.QJ�HŊm�0�����#b�,q���85���k�I��<<g�w�e>���,m�WG�n���w"��G�z��Ӈ��N�_.@e&_֣�9'����L�|�{<)�l�z���}��ߋ�_j�s����.�ܧ/�5�|?R�b���7�ANSlBE.��c�=����"[p�`P��a,YM��F�����Ő����P�s'$�>6�
��z��=�'�I��A��Xxꊏ��� �e���PԪC�X��J��:0���[H��^�lLD���TW=��O)ŝ/c��>ɜ�Z1��h�֊�9��A�T�P�֌/&']
>>��x��<�rK�\s<G7
o���
�I!��^��hoG�:6�OR��ȝ�~����X��3"G�O0���>ɤ�Kͤ���%\�1)����*H��cR�%7c�኏I��x��P	���O1Co�7x\/�	C����k��bF�{�'!�g�/FH���*8�����__ߟ�������zwA�4n��*��-��y>��y~yz|���OϿ�W��~��[^���L�N|�T�IcVd��y��65ȨQ2�����<|:����O��ǳ�n�=����9vfuk�iz�i��zmjzN�ޓ���4tdM����AF}��)K�����S�tɮ(U�讕"�v�sŖ��W�Z(x���"3����M̭%?a8��,�p������rnZ2��^��8�:ͤ�y�hu/|�d�5gk�JC| �F�\w���> M#B��L���x�g!x��˱����t9���tf�^��"��n:qQÀ��%}�(<��e ����rb����2}Ć�m����a�<zG�Qp�N<�8	4ݠ<�~�E	�Q�=V>0T	����󦇴��p>���=��
h�Y�=�{��r����c,��.���X��x�ҀX�^����$;� x}�H</	���ދM<I�wI֕jR��V�r��xV�eK_�1T�9�>D���&ʸ:e�JC��N\԰�%�TK��ڪ��7Q�����Rİ���u��1�qf��F�{U��-&��s�1z���h�{��l3���^~�Jý
;��u�fjz=B���Wr��|.Xm�ϝ�H��H��b ΅�{��w��5�`$x]eY~úIE#�{`�z'��4�����UŞW�a�`�'��+���IQ�oW��a3�4-.��1�U+E�r'.jxX����B��&�
�q��k��R��R�ĳ�\���,%��Hs��.�Gû�N<�粧�[�ѹ����>Zu�hF�Y�}A�rs��}�{��H#ML�L'0`*�`��U�pa:x�ުí߻R��l�x��u�1�N�ɥiI4믏�g���g3C�����d)�������������������n�����t:eg��ʚnh� ��0�C57��	��o���[V��mf��q��ķ��:�*��q<Ųģdi�g���2��
*�8�X��,-�o�-���ѹ\C����T�v��g��j�g3s$vb��2�@�Љѣ��yu�P�bpbf]�    [�YN��F1D�_g-�$��f�����X�M�a�b^��G�i�dx����3W�?+XfUk��d��7w�V9iп��r9�r9���_�_>%�	�����������������������sM�(��4L9ْ�u���&� �v�^������}�V�c}FȦ��7�pnO]�8][WXk�o��£礐x&���r���3���5Mͯ_N||9�����}z���>�~|�;29U�W�¢�S	�����6G7K��X���F������渴�M�[��R��\;��#�IS q�R�t.�X��Z)bvz�vP�2%5b}ͼ��VW�����ql���(r�b�'���lM{������z�3i4����?�AԝJ���j���!7{#�U,J�vP�p	��>�Bt��E1Ap�� �k�
�n(
n�}Jn� 7K� ���i��E��#������QN�ׁ���e�w�S�=�igy���t�t��u�^B3�Xo�*jnh�`�����\��@|�m�k�����b���A�K�����?"�b7>�L'�oO�+KTͻ1�Du|�Ǵ1��������kfP><}8�������r~9}8�>��_����!�n�M�y�"r�����E۴�;��������ue��WFc����[����������'W-��M�Z�������i�8lrqEт˰��x��|�[;5z��'&����z���^�Ț���io^ʅ�jo1��q��JB2y��a
��&SnHyܬ�0���̍�h���o��a5|+rm��K�YB�f�?��lX��#[������z�]ѱ�4^�7�+g�sJ�|���P6�o��b(���$�KV��Ex:����GMY�]T�÷��1H�t$8̦o��,#���m�ǯ���_�=Wdٍ�@�%����O�V<09֋�HL�H�kS㉨�z��\k������dT6=��ё!T�kS�]r��{O������M7�P18	�j�D��g��/G<�l|1��aş?^=3�<jo���⠚-�k�Ev�����`\�4��$܅��4���z��F2?��K��.H�ݥt}����h.j{��/_>�V� <\N�����:����ţ��Fd��4��][�,����eH\���e���.�dcsZ���H��k����>h�s�22�mj�Q��C�DT�|����|z9���x9�`yM����1�l#E�'���Z{q�KG�m�]��bUU���py�������N�k�$�����d�n���OB�<�����gJ�۲�!���_��O�J�'Rdk���n ��֩)��}�/�2|Z��>z��%�k���1����G�j8��kYQ� � D ��㈨�^7	��smj��q*��!$�r��� C5ٷ�����u*�]#M^�*�+�\BrM�ݷ�}8��s��r6]'8ٵŐ�C�.���K��%LM����&�d�X��|"�~8��Hv>�8s���/>���&Ox�U��o�\W�Gܸa!z��3����W��$�y� *4�5���P�Vz��>�Yg��Z��z*���%;�I+�FZibPdo�d�T�5�6�!B��q[��&͵�"�W����~oa<l�t.��!�Ze��}�o�k�s_��{���u2�]#Qi@�LhϜ)14?#U�C�0>��Ǯ�&�)���.}GkU�4M�Hs*#������"�ZHxBEz�2[�YUv�2���TD[ibP	�a�h���V}oTޯ8�|� /�41M�4�4�軮&��\�8�����~���Zib��"s���q���5���I:D��R��DD����L�%)��S��DUr�j��AH��I���k*��ܥ�dk� ��K)/�D1�qg!�ʹ:�ך�&oޒ��/�1�r.��l���;�)���NG{�j����&u :nAߧ�zݦS}�#�}�v�z��������"蛻rٳ���~'G �Z�&4IZ��41�u]����Wn�f�B������VGCJ׵���Ɔn	ql��*�V�T���%���:�Sڟ�ݜ��x���i��!%�[�����D��kή#M&K���J�J�����T%/UҠ��Dm4w�D1�q�!���׽7>�'����k%�!%��qI7�!V.9?���b��
��V�R��������9�Q22��H�"��(����� �wq>ݥpR�	.�}�Ȫ�(����k���M��G�{-&�i%�!%��Z��Dtu_߫��X:�Y�VMCJP����*}�O��i�~�y?gd>�	����Kk��Ç�>��jx��;��;d�������pձ���)��?�����珗ӯ�/�<=*!��?[-��� ��h]�
��t���d��p9�!O�R���&M_�W���p{.���JA�u�*59f&���gN���z��U aoTi�o����s-$�@vi���J�� #���_$ qؕ|1�ފ'm r+wI�$. ��*F�[5�Z�x���6V�`�4���Ġ"���"c32V*�E`=��`H\   s1IM�� ���Gٕ��i*��}��|�|������S�JZ�O���ˤ�C)ӑ8&w�j����3rU�Ϥƻ�S�h�Q��=�C;$.�ZJ �F�m��0i�Y[V�qm��#0��Z^Z`����l�Y�KB�~H\ v�H�\�BL���D�$���j�fb��Vɶ��<����:$.=e���ZEfѱ���������F�[E�Z��݃}iH\ vU��\sǬB�>d�:qؙ;�Ms2s��CfI�i��% 9-�� @}s�4 }{��2'�8�u����"i 6�B��ަ��A�1�[�����x��p�7CIq�o:���!�ReŽ"�U޵E�}���Gj�3rP�C�s��V|�	���$�=Mjҽ���n�����뇭׌��u��fEL��6gjؔ:0y6 ��<Y&�������&�T��p�y;ZU��u���$�sW����u�	RZ��qI����|��/fru3%s��V��m ��V_�b�"������k���l�ס�wS��j;N�!%4G	<���r]���CY�W%C���S#��,����K
$p������#�Ѫ��(�g� ���U�����i�V%,G	<e:Z�a(��
�q��QpCIkVp�.LB�pn(1�
���38����J[���p��$pCY�p^r��׮���&�^�p1�č���t7�JU�K�������zx��ъ-+8�QuRi"���@+8��s�<&��:+8��9A2�Pʢ�X3��h
��V�r(��|D+8����������L�4r��|L���#��F���P��N{u��+`=E<+0NJp���w���+�1��(70�n���:���At��}��^\�u�$�;�-��ﻡ|��Cѡ������IBw�#*tfx6�{eCw�%Zt�+0����ĥ��-}�y��d}���::�b:��{��4�aB��T��+��I+s&+4�JC� �P��L�
�z�_�%P�#��&"�1���b�ZU�׳�it��%�]�m�z�r�v;!J~�	�V��N`�4q�
���,�VfoW=�����R�c����V�T H	pT�k@Cu�3y���U�41�	`�%�,�0i�0w�u�T�T����x�l��8�ж���%��d�V潫�V�R�XBK�q{��J(��!�Fն�j����ҥG��n�$��捞��O~� �($���A!(�"m�U�/���Ɯ�:4	"��41���M���Z��o��&'�7���o}�J+��"��X�i.Mv��?�̄��U�.�.o$�gV>����������M�W��q~�� W@-���_"Tv�z���NM�{8�2��p9��r~�姇�pFM�l�.��w���)�E���G^A�Y��%N�0x?M��~��=ů�ӄ�^�A�ul�����1HR��z����c�(K�e2+��n��zn��u���lV&�2¡<������DtlG�^��5�#x�� �������$�M���`z    �HQ1���ӎϙR�:��WM싰�(��"L^����L�(��	������w�x/M�\:�ſ�=n7�:�$.}�=��J8����-�,�ĠǱe���~{�0�`�>)��rBG �����Cao:�AFǷ<�@Ԕ��d=��0�PDކ��@`ٖ���B₮{�O�X>ű-�X�݊ΰ|
~V@��>x�����a����n( pC��)�mQzF2$.�݂a���
M���\�hܠ�K�б\E���*�("� WaX�"��n(RqC�rx�1�P�↎�*�`��b7tW!�kzC��� ���
)y��r���\��
��@����}��ԝ���1��K̏�Kl7�s���o)KCZ [�Y��ű]l�@�?�>�2P�?�;�����]��BB�O`+�:�����]`��������"�����V�t��N�n�@���}�e�l��k�������PP���.���}7�����������z��������Z&�O�~�V�j��5 �]%���W�zx��FKM��t��p逵Őx��J�(4G�:���.>�G��^ߵ�Đ9�wzh-<)���%�#���Yd����V����r-��
/�#�㛼�ߤ�L31$B�x�
3��3̚T�l��m"��h�WH+MjX�Ԥ
�[q�^�Z.���L�9S�ٵ�Đ*}Z�Њ[z�2ѾFn�[�D2�w���GwW�1�z8\,���0K�(|��@W�:�B�!P�%
�
u^�o��^��Y�DZ�r���up�[��"�֜��KB;���A��4E�d�0�!�1�h�\���*Lk��t����9�NP�G���Đ* Omy�kUa� ��5�'!���]��E��x�8�mw\�u��J�Г��J����� S+���ݠU��L���Z1��"��mߵ�Ġ*�P�pL7��F5q�Q���(8+M'�{r?�	���/�#��:�iKk��FZibH�EG��0��1���W�^�9�i$��dpm$�!M 7� 7�K�W�u��/�v��f[�Z�bH`	hp	0݀Q�HkYK �f^=./F��\v����J�3�H=W�i�^�s�lh�
����R�2��	b��G�T�1�:�	�ӟY]wd��z��*�n41�
� 8�o�T4.�'��^��&/p�Ҟ�6[�ɉ�bdR8wٸm���b�1��u�x�_��)�sj�|��(����X�f�����!%�Y�Q0�8����Q�)h��G�UmJp��A��^�-/�P{X�x���)q���W�i\���>D�]�E��&���`IW�v\:���������o??����,�|���Y<�w��d�� ���B�Jz�cK� �9������|����J(���P+�t���3(5��9�._t{d���89Ԧ�f��P�σ)�6|�y�����Fm�<��7�Oh��\G�Р�F������)T��2U��0S}DQ��b(UR��bxR��č��]��n��^r)���1����/�/� ����q��"��E����9�Qx0I��� x�84U4�����o��_��"�T�X4���%��»Ţ���O�(�jn�S|������2_ոE���؟�)j�Y��bP����.k����K:�?>|9���~z~9}~�ݜo�T��u<��ƣl��PX�N\�Pc���R�-�h��a�O��\����䴙Lԡa�\[ib��k�'-�����c˞�ܴrm���)�=lN�G��g>�jQ��M�!�41��̼�#��WH�q���i����QS=�h��Q'|����o��T�[ibH�����x8e�Y��q�Rb�n��9���8�ޏG�SfI%c㤒C�i���iȚ�,�R"!W��N�k����Bqֹ?���f�ޚ�r��ϗ�ڡ/L �<���k+M�WT���i�ӣ��o��L��J�k��ŐxκZ���p*[=�z-R�ݞu:�]+M�ԣ�W���b5�z.l���gK#E�λ�����s�&�O�i���z4f��ނ��Л%l�g[������yp������ήI
m~�q�!�4q�G'~��lX�!9�(4���K�5��J3����Q��~<���>m�4��A�P�v<*� M�mIֺlx�k�Ȥb:]ƽŨZibP<�d=�e'�V��E���n`^[ibP<�d��⬏���J&F�2GGk�~㵕&��8H�،g,�e��2e6뗵]�h���ץ��_�	t�4���%z.��J�s_6�c_��9��8(��J"�D1�`_$`_�cf�5[LLR%(���<Uj�R�!��:o����2�e}Փ��^E.���n:K��&��r�(��L�j��vs0l��e:LJ{Q�w�D1�
���SF��L �j}/�5rBI pi%�yz4�����`)�3sT.�f�� (;��L�M����o��Y�t�TO[�K&W�I��<�Zibp NIN)xfniS��ΨlnJF�D#�CZib�*�ʤ�W?	Y�T!�ڴ�d�0Bc�1쓀8�%F;"\�ڒ�P���Hג��V���Ió皘P�e��.������(�T��E�"Cw�in�ڭ$���ra�-}m%�!= ��!G�Y�M�U�v�2Vi��V���J3$tG��|����;�H�Z�}�y��&��r/B�80�F�	j�P�䣕tf�K�5U�!a8�I�z:�����O>i��JCz �KCN1p6�#9���	�­�&�nJ�{=|p7��7I��d�]��9~��x��+drX�Z��r�
�\� #������R�F^���.9|q�X񰂍�sC*qL�^�Ь������&+4&ɳ�)�9JP�S��1J�
.r��Qp#5�����C����83S�����U;�U�.����s_�6���������-x�x�`/|n���'���"��� 1h�����h���"Ht�XxԊ�1Y�_�X��P����g�_�3������	����9K�V��o�����p�J��;X�{�ǝ��>+ho�7��9�U��s}����)����u����ᧇ�����x�y}LuK�E��t:��+�b�H�N�h �ߕ��ESv|�ʸ�R��������r����$�s���$~~�c�b��|����Ym���X_�Pq�K��'����ν^m@�קh���%1�l3�N�k����'�Zq��w�m�A��N%j=� {1���H#M����xx�xԁI[��@a�nz��JC��)"��L�x4��m��Lؼ¾�_�W�� ���C��ǯY+��|���j��!=R]6�1Q�x8x�$�%�pk%�y�у��q���e�lpd-�:��� ��;H��w`�3�69:��1M��k�ʹPA6Q�V����������6��L�9Մi�Jv�41��Az�F���
�/o�1�!�r泶5uK*'e���{�V���;�!�rR熚fr��'/� i��~h��l=��a��0�e�T9��WH#E����'�u���s�h��V���G3��kn�MT���4��k+E�NAڌ+qmP ����^�$Zm�à��G��夲��?�M��6��~���c^��Ҕ���s:r���Đ@)ǥ]�8�S��-3n�F_��޵�Ġx:݆.�1���|��j��&fG=�g�7�F��se�"���&f'�mƃ���,�7KQ��3g�f�2�_��2�*�_�?���ab�<h����M�_�&Py�l<�J�z�Y�����h)��i��v�41S����Z�5���CD��*mCv�41��AZ�Z���ᐛ�,)����z��(����2��J��V��@�yy(�e]5`�J��h�|8�h��␿M:���v9XA������y�s)�ݏlI�s����u���(���3s7�c�-��LR%�� 6D1O�f<��93�k>�*���xg�ui%�;=:�4�#g�[c`HYEe��'�yzԷق�]��h�5/���u0w���J�z����ye��7u�q=���^����J3��ϫ4,����޲����F6��"f��oƃ�    �����K����"f�ь��hC��aMQo�5�a�H�j�i�᠟z�pxC���0X$y����z4��{|S�C��in�'�k#M��q�ؿ�i2��/P]�Y��*� 5e"��R���ؔ �6�Đ}`��v�W�?�i���>x�<\�%㣴�ϏO_/��ޑ���Y�N�.��p�����5���������?=�]�g�:;�F"��.���{>O�J7:@��.�#i̼�S_�ç�y�?=�3��B��ƥ	��֜#,t�;B��H���.�6e�(�'7^���bbp:u�jz%��g(�sP%d^��n�.܀�A%��ȫ���^��D�`�B[Vp�ΣQ!@���Q�o	�o�A%��	(�9JD��(�G���.R��A%��sV%8V��O�+q��QMjD<�k_��X#	#Q},xh�66p����/��6��xC�Jt� "0��ކ��!L����"�Vp���,���bVpSg��4��³Vp���$�jҬ�8��x���[����a�,n(Neǲ����Yj����n�1�čжE	�م�H�#�_��Y�qvW/2�-.���x��x���b�VpOb�2X(���7+8�'�����NZ�q<��L{8Z�g��$岜	n(nj��$���P��ǓX��
n(�k��$�|G�An���6F�C�/�uy@�;�I���@p�ο׋ߕ@ ݡ�����5X����֫�W�t��K�:�$zqA�M;��Up��|�zwG��n�&t�^�Ey�$�c�C�w�^	�;t:ޒ�P�H\�Z��~�AWB��蠚]୽�Vš����\���@��wݶ���6:�;JJ	��ĥ�Uq�*:t���]!q�n�nr�u�}��t�("�Uh�6�=���v�&G�qб�q�	�K��"r\�šA�
�4M;��Кo�aW%$�F��*4^BC�3� qAםwL��c�>t��.�\{�ٓ<!q�"�S�YJPt�� �C�C�,O�<�H�$.��=@Pd�sl���C₮��y/�A�6(}� H\���,��<ۑ�񼐸��]EޏrбYO���]�*򎏁�ㅢ�]��zW��Tt�K�%�T�*򶅁�{"S��ɀ!qA�_?Y���������~��$<�e7�n��w_�s�&D�h��=�-R����� ���	:�[��:G.��S!f�Z�m���r9�r9���_;}y9�~}~����R)��1��Ln;E�M�L�9�;���}c��=�h=-�?}O�i=u�&!bm3�8ӥ�D�c�y��`ş�:4��1ӗ�x}/k"*��?�o���s���_z�pQ���[$�k�y�b�T�3�ҝ�?�{&guS�`�J7���kŨ&��S����r-^��h�	X+E̮x����g�D%oY^��ǩt�T��Wr� ƈ ��MĐx�Z����:�ĵL��B�v���j%�=j�4��)TjB�ު�K�͜ei�hխ|K��k���宕&�/�����f��x y*!�9�]:�%��@wz�hB�8����V_CLB	�U�D1�^ɢу�|-��D�fg���HY�&1kY��\J�7����@k[�C�����^��Y%��f�2��Z�-N��J3�S�ܞq������a�l���Oe���A^ʆ�:��k<��c9/g���H1�'���/Z[r����ߋ���x�L��)p���:v�u���MJ��k�Ѱ��J���<��,̞�����^�7`�Ai�I~�=so��3?0M��#�
�g~��5��^h7`ԩ��� {�܀Q'���l�qqF���� z�ۀy*0�{�ۀQW%^�6�^��T`��?�T��Tsx;��W��\�K{ۀQ�����$�� �̅�
�9�O̿����ISM �(��eR�2�.�.9C.�'��M�k+Eex�7#3�J5�������/�����.�w����4Q1t�=�V�)��H�#��C�~F��V\Fq�'���-V\���9�	��p).{̛qݖ���������V��b�q ܆��焀�u(n�e����=������b���۱�'�:��p����܅�ի�����%7'%�ߧW�Zib����}�M v�=$O�<t�X:X��h�'�_���d).���8T>J�;F�Ҷt�o�?�����2��`h�n,��?q�ޮ��~�G���F
7\T?�����W\T?��s$�pY�9m8��:9��y����^�a��vL���`���915�!6s��<@�9��/�W`�i����P��
,bƵ�C�@`cO+0̺v�x�(}(�r���~3��|,Yqa�����v~i�)~��������3VR�R�;�|�y��~L��_~zx)�[ir�s&��W���V6�Y\o�4�����u����4��e"�_M�:��dk^ɿ<�7�P�҉_�|��d�0��������p�	M� w�6�7��<t���z�
��ż9�a��e V[�.z��꺂�ԊN"]4���&���+��)�ա7
ŻŎ�=u������)
�����"�o��WE�[줈�(�z��J7�_Q.�9�F�bH�{>��z�fV�K���2��{es��З�\Z)bxfJ˞�QD�fVU�,������3���CZi�^�N<+�,�W�kGW�/��v��܀/��7E����ӊ�W|���=mra_��&{ط��ma�t��%��*��R�!8a�V�T �pDX��*¥vl�0��>��J����F�U=��NsA���U}4��x�i�\��i��m�4>�o��X+M)r��(��鸿F���H7�$��鮕"f�4��q@VL�5�Pӷw�D1��R+bS+L�.ڪ�,���f"��u��]+M)��P�Բ��QH�ξ���zw�D1��S+"X1�$)�D�-��l��]퓵�(����E�Ĥ繇�Xշ�<j:�w�i��擊�UM��QD��&��FХV������������=���ty~���"�&���D�n[������m�m,�߆�Y)xj���"?��R��m��G�W-O���o�՘��J5@6sH�q&��ő߉7S�P WS[!��sQ18������FWV �p��@�/T*q\BaU�0��x��Ěݠ�����ϬJX�x�eX	S�D�U�JׁX��\9��^�%O����B�cu V%8W�Q�� W%ꯏՁX�9�gЗS���L�-D�|˹)!9J��	hՁX�)8GX���:+8���x��P���� (��:+8�}Ź(��:+8����P��r���Z��5CJ�(�*A߬��^i��2+��'�Ss����NǴ��U Vlt?���an�
�
��G8<�7TbG�#	��7T���i���þc���_o_�|y�6�a�Ί=o�j��5 ���ݸi��u����������???~|=����K_�2_��|[��;��d0��7E�yF�<��V5��F\�R~��ox&d��������r��4O����矞_Χ����?�^s3X�S�tE�I��=�~bNU��6����2���t�Z�WI����:~��b�W5���T�'�#�\Y{�p�i�����bIc�M(�ͽCZ�bH���0'?�UHK����6?њR�֥E�JC* Q�bv"�(�᫽
�����VH�^�fp� W�n�ż�o�)�zv�'z��Y �ă)�ż7l.������q�Z�w��\_�)_l�����iE�V�T�s�@�;��E$��tZhA4Ю�41s�5��j�=4�:z6��#�41s,�I�YcaZ&Mv���X�j5w�q���+���ѫ��.�u�+��A�z��ZibH�q@��*�j��^� �7���PD�5uf��{#3�+J"�̑��+.&�Hw�xV���� jQ��v3Z��!�Z)b��P-����&��K��\B"����R�o��*@J��^D0�)�H���PK+E�V�����zY�(    ����0����!b��׉�
�k��������Ѹ�bwm��ي4cA��չj�ކ����I�{m��! ���Y��	��#
'�T��Z�j(���6�M��B{V:'�V���@��Rk��̮���5���39;��lH+M�Ч�ZJ5�ɰ��Y�0)�|M�ݵ��LE��]���W���iU�20���Ab�[ y�:J�� z������0�ݙ��&�V�T0�
���-�űa��r�j��&f*����L������̅{+��G�Q��Đ"P�:l3�6�l&}r�j�<7�Ai����s�2�T�z���cN�d�d�2�#۵Ő"��R����ői~<d��ן���Ռ�]+Q),-�؈$Ero�9�A���L��`�x�ip�A��Y��6�%�z� ���>�@��_��vlο櫫���(�T����C�P�~A��VR(i|�[Q�S��&�hL1sq>�H#�J� &EC����Tp &-�P�`$�J3i������e�'3�J�*�i����['�U��ӎ�M;��I֥I��^���Ѣ�41�d��}��������������&Zy��g=D�������b���̀���Нd����N�u8��V՗�s�5S6iH]DibH �J���j��xLy<k@�/YT�pV/�b�t�<;��B�O���NG�pK�4S�CŠ��y>9o�~x��ۯ�ǟ?^�*�m�
��˺���8�~},K�^:.�(������u�=�QfB�P��a`#�G)Q`�C9<�A�"�e�\J6B}��@8�sE��K~��2d�5!s����\6��l�0¡d�+B��>`£��9���ã�2;���0�#�p(�㊐o����=�#!�b��},uT��M�L$���g�\!�67-�x�$�8�r�x��t��8�r�x��45G�B�9C�^�����ӧ�_��5R�{N�f��#�wb���5l��g~7Μgw���Ͽ��~9�����z~=]�O_?<��VL�OڙōP�U.���E�Iy�n��n���k,��:�n����/ұd�+��Ƹ���ű��D}{��BT�s�x����-~����sm�o��[��ߋcY7W�l��5�Ja<��
��v5�4^�m��v�����z%����fB�XU�"߻T[� ��,F�r�{�6݃%�V�|�rP�{(!0І�]��!������\�.P"*`#m���pq�8�
��]J�aa��(`�c���Rq���
��]�6g��⊐�\�'���+D�s៌�,����0O�.����Z6�v.@L���e;�8Xr��v.�L  Q}ߧ��"�\,۹p��
��@��-��[�b�d�����}��~�ù<��<��tz���(��v�2�[_���n��ĭ+[����z����?Q���u�����@C����s����C�l�\�t,�5�U%�۪4_�W�Eӝ綔��b�l�Ԣ�v�R^�;��q�4�
��tZ�x�Z"�|�r�J����Q�?ȴ�s��E��N��`|���	N�A(#�\�N���N�ٜ������*��3��L�9�N���r�]?ؒ��T8�-r�i�	�Nے� .��S�|��eᩧ~6siu�H+M�t:$~�/ׂ�M���|��ƪI��Y��DZibP��d�\ӽWA!E@�du=B�6�R�nH���d�+`�5's.S)&�c�x�J�* W�3�U���Ƴ��d����/f�@�˱��\���e���k�]�dS���Ġx�����f��O�[��{�&/�i��{E 7)��O��f��O�/\c�2/֥mD��J��쁣�r�ha����{�]a!cJ�T:�����(���E�&w����pX]B1�[�0���
i%�!E�W"��w����TI�ln�z�v&�h�U��41��Pc!EX�]�6aN�o�yǉ.Vam%�!E���"D�\JZRכۢ��5#�J��
<������H�kE������?}}����+��s>M����;#�J��s�mMm��s}�d��F�������;SЪRQD+sx��ҿ-�R��؏�'٥(\R
��I�jǟm����J����<�]���8�r"Q��ͫ���@�^6�?fNr��[%[t
��<FG� �y�Cg�۹ctp~j���:�C��}G���Y:=���槇�1W��s����B�[d���W�����[�U��fm���V��&��QË t�U�A�1:j����*<�8DGN��c���YF8�.2W�v��h�㭊 J��QC8 t�U@�1:jp���*@��18j�ANKu��?�����ן~�t>��x�x�����|�<����e����9-	z�V�BӮz3K����ګ��hS����?��d��+��dm&k|��T�4q3���Am/����/O��Ͽf��/O�����Ǉ;���#��d�)��B��[U��|#�jD;q�KJ$�`L�w���\�rYI�f�nK7��'|ɽ���&~���w}��Tn^ϟ~:���Ź�8���Y�%9�ܴu�P1�p�/�^���)��M���r�>�7���ff����ֵ�a1��Ӫ[$v�_x���o	U�n�p�����Qw/_�[���|�x`��A5��V�M���-<���Fa#&���?}z:���2�o���3h�7�p:�3q�Pk��H�$;�>ϼ�i�gvnoaĤ�R[@��c���'�g�I��O�pzܟ#9�P�F�p�p$�Eh�5N��"ܝ�:��^V���i��}=�U����p_�ٯ��_+�N&�p$�}A��+J�lh�Ĉ��+J�q�(�����k�b G��P:�f��!OY*�ܖ��f4�ؒ.�9j�K��r�h����}�
��M�Xw9#�:8��YI�������ٺ)S%��ZibH��K��a�����-̄���:¨x��K{��΅Q�hu��P#Mi���h�:0�:x��ߪ>M�ق���7+S�S�X���vWFT�)&#X��v�1��P��B��$�d��%_t�Um2l�����&�U�ĳ
�)Ib���Z�FO*痆�F�V�T i�$�\Ccڒ	2_��B�?V�41��j �Pw+5�n�
Wπ�����A!U�/Ubn1�&9a$�ic����<�J�* a�X���P4��K]!�%��ibH�A=9��A5daFd:p��AH��&U� �)�<�T@Y�3�Ǧ]-�Jæ	�2 Ӥ�bL&) H��@rt�ȎO�41�Z���MD�����d^B�Uפ�b4�9��"�Y�P�	�]����u?�Y\ �|;m���ky ��@�)�CA�vV�e���1���۵Ő
������o'�L׺2(�AZibP��B=����GS=`����)�E�F������Q�hgm��_��-�� �HC@�\ 3��j�4����a~�+��thj(\ibP����:����\�:�����!Q�B'��A"�Y��6�[��'��p���q1��hu�v�����W���eTj_2�j%�;y��,Q�M�5ȍ�k�݄\[�bH�Q_�&/8���o���0x��&�@�7�I��o�	l�~;9)$�J�*�1�l"ZMo�Q؈�&E���K�V�R�hfg��l~$?봿I�3�6R���F�s��V���˯p�.(�����/�ܿ��ˋ�������˧�o�+�
��T{2r|����;����X�1�4T�1�o��U����?o4#2:	�xvb]2ڼ� >uz���:�Cg�}�tr�v��v�����$�J�y��q)���gL���
/�}��U�(�"�V�5|��^�uw�x��ct�8 ����V���+z@�x��;~@�V���*<{d�u2 t��*r�,��M�@�㭊 ��qjmoU�����Q�&@�x�"h~�Q� �L�s�,�EH�ȱ�<)���t��3�^ԃo_�hcFG3����)�B�x�    �v�kW�_I<��ƌ��U͠��z�O?��ҳ��F��smCuv�3z�S�����`�"0S��� i;ʂ))�P��/��>%ktzx���}���rNX��^O?�ӏ�~;]~�r~�?�x�rV����s��t@���f��'�dB��G�xڏ#e�V�j���8R�gh� �}�1�8�}���;J_�,�ƴ�,�X$#�������|���唎����^{/W�D=�u�I�a��B�5�5�����ZbO	��5rP:E8��W��E��r�(B+B7@���ًCI ��3ٹ���K����߯_.��O@�`Y�&�+X�����ey��%|D��;�;$�����>��Q�K��ru,a�Z/|Y�H��0��l.�$�hyèˣq����X��"f�5,��e��+E��>�HHf��i�9��&���
IR��+/�"y/Ԥ�5M��k+M* ��W@	�o�~!<0ĩ"%��,��o�v� �41��Ar��Mz-n,e���a�t)�n���|m���Q��c��(W�"?��Y<�:��H�9�7ڗ�������j��_zrߒ��=x?��km��V��97�).%c����cL�1�eX+M��'�l�8��+�[,ɑ�{���K]��޵R����8h�8�z���#�f�B�6F���Ġx��z,��7��s��d��^ h%�aXib�<j��2���� %I��y[&��^#�1�?�\��p��*5aM��1Em��v�1;ڥ����Idl���v�g`$C�k��5�FN޶��]+M�+Љ��po�Ԛ�����wM ε��� 4��HfF���v�9-nDZibp�8�zm�8���j�yi��A�ЕFMR�Jt��t�S���4����HԈj8���w�jƜ����!BQ�c�d,P��� X� �V�	G��\��4=�� ��#��EM�޵R���z<��4上"m���G�|`$�h�����
5�|�Z�bH<"�Q��@C5�K8BȦ�c���!���
Z��d���;25ތ=_�Eg�rM���ʃ�H#Mv,���'Mm[��m��\2��X_[)bvR�F�̰���>/����*��(�8$�7
�֦�57|c�)��9��(��)����B����2�w�\Ő8˼ٞ["Q��	eB�r�B:�4�ĠP�Kq��?�<��o��1�1g���HB37���� ��?�Q�mw��4���K��h�����m��I��{Jl�g�J3/u5"㢥�U����s��}Ѡ��"f_����i�ў�q�
��	9C�R���W��8�����^�H�����$��<m�zE����mK}����ɢ%����~�Kb��Z1G�&�� T�4q�$��H͕s���R�=��>�-��s��^�4R%=��s��Zib���"�s�Pr��4�E���P��6��T��Լ�FV�Y��!��)�
��q���^!qӳdb��;-0M00�6t�� �@vT���r �ȍ-��2�00��5t�5-0#��#�.`p�k(e@7�0�5�����ø����1�ɄKQq����x��P�`�
�m-�*�`~5 `�� ������GF ���%��G$ `T�ְ8~��Qu��j�=�Z���4���&`TÏ5Q`����U�0��|s~�G�_R?�Z�vx�T�ݗT�V5:~�~ջp��`��58@\��"Vy��j<���'w#�M&��,���+�MI��
x�m�n!q�)ItS%��:q�)ItSA2���+!q�;7e��ؗ��s�;��O(�Q�i����k�u7��2�`��:�2�������~_��*�ç������Tsӡ�oF�b����w�>�!��l�+E���Fv��i ���kD7�6t��.��A�6��,v��,d��['.�$��q�E>:h��吳���ro3(&m@���}'.�[ޭޫ�v�Y�+<ρWW��o�7pv�~7b��hWx����ސ�X�żC��|j��/C���'1W	b�&2��i���Q��>� E��yUr�ef��\�U�w������{���O�1��a�����H
с���1:�Q���g9�y]���_
�	1Y�J�3 ��І8}����x/m^�鐢�de�V�R -��F9��hz!|���j��Zib��+o`������6M9�����Ȯ�"�ַh�S��|��m��༢=��q9����PW�1�<G�@r$
'��Uِ��H����q:3��E�Cmw�41� Z;�U����h���r�X�K!E��& ����U��򴨃j����I�P�]+M)�o�e�! (@�DQ�s۪e��m�4���>C̑�n���C�r+�}�X+E�	���
hn;��еW�z6�8{�t��g`��p�!��P6sc��Js+��
������^O"�@%гp=(w�����Y�X���'�g�ԳZ�z�ZibH�RJK'-��dѵ̆MS�9�V�ď��h�֜�Țˤ�D��+����5�IS֘���8��SڪV�U+E�-��*@2�փ�՚0i��]H+M*��h�㴩����|'r̬V逴�Đ�A�S�d\�Gv�9�#H	�mv͌�gIF�6L9��|Id�4R"�D1� `5d5in[l�9��M�k+Q)��sh M�����~!
�k�V�	t��ŝ�xV �B��8m6�U3�M�h�V�T -��E�u�����%�� !���N��1�|��H���HrR6��o/Q"5�Tq����4�[hG3
�u ��C�`eJ�]��v]i���&�ЊmF"�y�>N�;J��h�wQa�41�b�	
�\8u��r���&G#�w�]+E�\�t˹_��-<7m�R��x]`n��u �c/.}�{����j���������t�p~�����f`k Z��h���{x���	�� a`'��F�߈Ҕ��C���cv_@��X���DH�n�Th�O*��q-j��Ўk��(�.�C�D73��Ń�*�����v`
�㾆�P�=�����1Uu�T�	�TM�m^�I~�ű��癶��ap(����m|#g|�B7��;6���eZr����7C��/�V:�t�!�����O��1���C�wly���5`����
�X�7pL> 2�Kl���*|y��;f]��\󇧐F�o(xb_����P�C�
��r����݇���[Ǘk��[űX�m|�ϿT���m|Y�+�Io�y�ks��oAэ���d�6�G7f�Wt,���i���{+:�Y	|tcFoE�Z`m�Ct�6e.�s�^��~��������fʑY5cl��RqR;�V��wY6�����&���C�}���Uu.�]+Q���U�b�l�Gʼ�|���&"�41x��j>�����oŨk::��y#�/y+VZQ� ����[�e�m&���;�p.ڇ�K�Y�e���qX+��]��+�U�u2�ԣ��X��Hk�#�j7PY���$@�����k��*�`�����'�͇vZҍS��,,4�=1���m��Q3�,�zZG����-wΜM��c�y���2S�/"I<�Ө�\�NMf��ꇞ��!�g��_DK�s��a`�?����13���%�`�һ�{�6&	7LW����ϔ��(e�W���#���5�A2u��)��d?U59��#��s�B��$�������1Z�5�N�l���l���0�8HʱΘ�'���Q3��ڌ$u�Ųo�{Oyp�Vs�RSڕ.݌��-YnJ|ԉ�r���v��CU.ќZ~Gq�%_���<1f�A:i=��p��M6���9�Yґ�ox��Z�X���N.���k"�R��D�/�C��4�X�ir������rl&�U��Sj��%<fxK$&ý��S�U����i����b��"Wv-�a��ef4_�r]"�a���yR���Q-O��A�:7fp�`F��d����0��'F����!ݰ�d噚>�5YL�    Gh9bi~q�:����ǁZ]��:<���i���J�����=�!٥&����QS�T��8��/���x��i��S��2+�"t �n@rMF��W7�;-S��Bf���*a_16mi�:��ʵ��i9b|�E^F��vnI�H�R�#tl��UT<��#���N.�a$�f"MO���)�L!��/"����^��X�|>�������23��nD���4#4��վĦRr��J�z^i�	�^����m���<1j
Y3��+/�"z�ҲG4��q�Z�XfF3��`��DW\���Q3�ډ��ӗ"�(�(ߩ�m�剱+_����X6������#�E"���T�ܼ��*Ÿ�X�-��13�V+�O���F=ӑ�r�d�Gq~�����y���n����UF��?p�B��*9������S�B���ʄL|#�����zi�|�p�^�ãB�o��2	�m��|� �2�߱�[�o�V>�3/{�4L<G���E���P+���&Qi�x�}kj�p�F\%6֗b˼T�����}��	�� /ljR�����<qz�'��y%�K2��1�v��+����Zr��Dl�'	�'���5�\�7q��X��-�\���MfH�C���+	�'��.����~I^V5Ԫa����/�S�c�N<Ķ?Qp���#��6���
�����7���t[!r��6�5?^�ۢ��޷����F���Vt��/��D7����$�V�o)k݃�����J���� ���`wZ���Cʊ�~�t�Pw�՗t:��[8x�8G�"z����:Z,����OC�A�LgE��ܯ��� �bL�bx��2�KKe�I��f��^�2eL�	wZ��2d?޶V&
M�՜�Ɲ��4��$���1S�D �5f�t!'�Z�@�O��6��W-G,m/ܖzhi�Gv�վ�|O��(yb��>{�+��搄w�u�M�֚�2Ř)H�w��)�U�L���a~�}=�;-C��٢��*c�>
W��>�R������bJ&�1�葢Ņ��[��u*����$&7i�W%O�[�� �K[�!ܺ��,��-M��u��N��Liz�[W�
C<����3fvJ����T��e��.$���e�j�֝�'���TXIAE=�S�_A4�D&['��<1jr��"bF�:���Ҷl���i�;-O,3��X^�E\[�O���UR���Ĩ�e����~��͞��)g>��w��'FMA��4�EL�ԅ���YGe�&�<�̊���������k5!�r�۟M+-O�����a^�H�zt8"�̩)�jyb�m�;ׅ@�et��b.���v%!��'F�@\��\H�޵E*A�,�l똚����#��^�Jc{o�(	��Db����j�b�d��Xo�^�V�ׯ���:����h�ԋ�ʔ�� @Ι�A�3o�e�Q��N<�b0/b�^d*p��B$^fmu�i|�2�b3�/"u#)"��ﻔ�þWj�I1f
�c07b�nd*���<�c7%������B�23�k�����"������'F��r?07�'0#���O�-�ƫ!1Z�5q!;�8�ƫ� jK�w�\�C��}��/�`�P��fv+����D��0�l՚���Ľ�x2�b��,��7O���S��hsð��Ĩ�Ұ�
���������N��'F�������������\����ĨȺ�������o�Si�� ��ύʺicp�����(F"��pĦ�����M��U�c9^yg���k��~"���e��o,P6,o�������Pg��N�H���7L�x�R�+=��S凇mS��˶;�t������ǯ8%�����O-��Qrxc�� =C'C�sU��"t���o��`<ٷ=HT��m47n,�&���(�H]G9��0�):��?�S��C�3UK�<w;�[�Xl��*��v����'nf&��_���8�W6As��N3����� ��	ߡ�&sc�2����[��L�_G-rFM�y|��2�FM�5y����<�u�2k�4	����˨eh��eȬ`�P7��i�{�������;�H:@ 2ˆ��t�Y&ۚ�ѩY6�M�̲r���/N�ېg^�-����yb����q+GM޸e�|�۸���D7͠�m,=y>��#�������ӏ�{��������H8;�p�i��䞒�[Nxw����e�:KQu?�;#u��l��ٖ�P�ls��l�����`���J�^ᠹ�u��>����2��3���-��NV`���M,cB`Cm�]*b6�0��"�6��X�òN��y &Gm�]̣�2��?]N_.?�[��1�7l:��?���f��j�ZJ�]#�E�M�^��ژo�%ܛ�Ϯ�j�4��*$��ܝ�#��kKXL1^�Ij:vȨ�i�Ԗ�M�_�L1f��_�t�Sd�IBW���t-��r����BS�O%��*/�goL�@Siyb̎�����j��t؊,�
F]������ZQ8�>�ʞU�
�!�z�X-��t|���,����6QwC�hyb��4�j��z�rD���]>�.�/�蛶1��qi�$c5�剅���+�5�.��
JԴ������)�젫P�YS���`��6Ɣ�v�^s�2�2S�O"��s݆i�2��g��1;jP�Ob%aE�{e�g��*W�4SF.��n"���h�n�;���O�~p�W-G,��)�m}�p[����¨xP�j:❒'�-����JyjK���F��B���u��N��vЅ<��wJ���r`���tG�))Gi9b�)�'�{1}�s��#���>A%�i*��Z�5����w$��1u�*׎	��ޖ�*��s\�L1fY����`�cV���D�C��͔�jyb����Y Ҙ���;�\��i�Ȍi&>�|UF:�y���=e��m����)F�8(l�g��,`�k;�� ���B���(;$+X7�3�J�?lL��2ŘtEc�dk4�=L�~�����[!��4vHև�XA�vTm]"rډD�V��q��_��1G��KOOpih����Lh�b�2ս5C��S=�kں�e���Lx���wb�2׽�C	˥���������DN	'��+�(�4߽�� ���l�9!=MY�%.wNgOh��Δ���Ɣ(Y$��H=���/IpU}f���Q;Ȅ�v�H6_cR3XK9�;k���MWZ�X�=�U"��
���SK VL	��Dh�b����ZZH�>Q��'b&�<�pv5��VC��p؉���,���)�L!k�/q'��$��*�V	(M�%-S,��^(Z�ڣ�G3�@�Z�Ʀ��U�#w<�;;B��y���|yz{~��+�Er��~7��k�'v�����G4{s�&��'|6z/��燎%�n9�Q�Y/�7�]��˲�ty��P���e)�rxC�<+�Kg?��1��#�dKË�Y�.��x��'�� [P�,��/��!6z��!^���0&��!�NQ�2"�$�����3R�e+#���<|e O�ٕ�led��?b�	��E�ʰJ�U���	� +#�V��!+��?Ka�	^�4t=b��D򣒅,C�k!K�XK��h���3��M�K�1jI\�2X��T�@N-��c��=�����Y$����	�fɡ�W�:܇�)[��1��w���)���qV��i�a�$f�:ct*��'��Fn���Ĩ�P���a-Q�3���"肓�R���B��[Xj>w�\2vm����(�֭�]V�`e�w�\�����Q���늿:2;���7ѫ���oo�/_�.�����O�e[�����T��C���������[�k���&7���ܔO��m�S��a�6���v���	���Xxn�i��n���N{=]^��E�1]<�tN&��MW�e���^t;TI!�N;�L��'�6{��%G(ybt��Q6�����I�ޜS�M�N��v�7�*9�Ѵ��Ν��̥[����l�e�1;�i��ieD�*Wc�$3�{w�9Gh9b|^!/�*c��J�UV]���(
�B�z���y�<A���++	{r}�j��Lg��.�	-O�ځ�=�{    �$���M��Ӓ��c�n���Q3��'�aO1C�̳���3lWŁ���N���\0�Lc��J�y�[[,�aj$�4���~Z��a��Fl�;�*�R�D��T�x�r�X�>z>].[[3���zLWn���Ȃ�u���'Fm@}+l�;��gU3���T��÷!�:Wb��Q;����T^l���H���vfs�B���P
!cG��]%����L��Ϧ;KL�8([�A�e�u�2-�ZR��!�~sn�R�P�ٛ�і��Tމ�����q��(�GcG	��!�V�cĭԊ#�ڱ�
�(�p��z��g�N�K��q�AS��k�SS*�;+�>{4�'4b��,��,<��z�Ց���ͯ����%�&a��٨������Sj{��ʹ*����#�,�ē똍hSU�4U�N�H�c�
HMP���Ĩ)��M�)2U�+���/'�O_���]^��97c".5�����um����sR'��׮���)�G���@K^[��tEk~|(IbH��%H��$�Il ��l��[� 8�(�R�4Ep(Ub��Xө&$������k:ل8��LB�tK`�У����t���}�հw�R����a;�(Ӷ���ͨ��E�Z�(sAgy�Vw5���uԓt�$"\�Z�XE��av�'�5�Ҭ���bb�g���po{o�U8��7�=���.)��e�����Ǯ�e5����X%��$T��4����^s*��ø����DKŸj��떣�߿j;�%3
�>�iz�r��'nv L<-q�%��loQ��)Sg��l�9�O/7�z�3��g��إ'������6����uB�?k����]�I����v�Μ�'#N\��}6�i�KAۺS\,w��[J�z�tT��z_�"Ũ�%�ވ|������m�0�U���Åc�1#L���{#�:�>�0�aD��ի��� �!���{pG��8���Qb �p��=8�X��Ͽ���11�͌���Mc��9L#p50=8��B��D'.?���u��+��b�����Ga4�I���0p�N��lrp�^݉a�z���A�h.ɧ�7ڋa�N�ӗH$���K��!;�����p����0r����vw�8�����J�1����8|��prvVȆx�naE$c�Kb
����p����b�����0�iщ?�q��0F���B?���`�	]$t�~�A��
81t�7Z�CGܢ��ItCU+�(Y�I�1膮ۖ�a}�E�<��s��K9�����쏘"/�{ߝn�T._ �� -O��P����YL���L�O���|�W��+�O�d~xǡ.�rp��w���ϕ�'�R=l;w�sl���T��\f��z)�dB&�<1f�An��{3�Čj�^���9:��.J�X��\[��
WM��_�:��6&�&����Q;���'�#�H#���̷��7V^�<1j��ء$v���.F�-� ���̩����#:j����5)�N���!eMBS|����G�0A�
���Ę)�˕)��d�����x�9j�#�<qoJ'�n���|� e�5��&�I����7�-��O]�@N�yB�c�Y�x2E���@�K��a������+-G���t��l	h��S�Bg��y�	�j�OG�>��:�G��T [�'�n���k�!%�U5m�Y:����\�@vZ�3#�0}m1E�wƆa�M�^�ޥs�:�;�N�c� {�A�N��_%4����qΨ.~0x��N<�ml��p�C�U}L���"B���j'�p{oئ���GM\�*(]os;-S�M,��޵�S5o���N^������s�(�@�}�,>�L��L'�!b��!�}���ʨ�D`�ʬ5��#Ɩ_'�'f���۱��nJ�
a�qi�WZ�5Y��I��K�\��R������2��'FM���S�W	����askp3��8����E��W"t���pXc��>�:�7�dz�I�R��������M�����������G}��t,g��_
�����A�U�����x������xB�$Ƹ|tI��3qu�����M�������C3��碑	�iBC9d`Қ�Gĥ�
���)�L��)�&8-��j3����'r�PV�%�<1j������!g��J�G�٩����+-S,���(Y3������,��Gh�b��d5��b�k_�ܹ頛�*���x����}ݜ�Y^2������4�#���剅�����/nx+���[�Q�9B�ޱ�,Z��tۿ��&J�h�A��,u�_�1�u��'Ϋ��./Pt�w���>L�=���n��%�d��7u>,� ��JYS;��61Řt��z��fq���.�<��M���[[&�v@ ���B�S��.�jyb��6p�g}�����r���~�w�d��-�i.��R�T5=�=��&w�[�c���������{P3�ecC��F%{J�˿G�\�;bUM����?���v�Tiyb�2�d�(��X��5�1�9#$����gI=ۃ$>�ͳ��?��-��Chybt�醎�,1�M�zr6�^�K����()-G,6��%��������
�=Lt�S��'FM��6&0w����^|}�dմԼjyb��e� $Q�6���{6pl&:w/��[����r,���'FM��d6C,�~ݙ���H�ʖV�i�ib���U�fˡ�C�Q�)�Dk�3b�oSE�ܔ�6=H�4�b�V�ڬ	-G,^��	�ӝm��a��`|�
vZ��㠻i3����C�.����Ih�Hhyb�)�̊� #��v*U-��I��z���<1j�5v��ͯ���{Tp��C %,l�BS�O�-3Ј�~5w��S���C�!���mnhpT�eh
��#��s����c�<��Ecm�av��Ń��f4�f����l�izH_�L1fݕ��&�y*hY��f�f��a=O���U����vK�����r��!n�E/�!�Q�M�9��W-G,6�qU�衢;��8GH�N��z��iyb̎����'�F5/�#�9;U�ys�G-D�BS�-����&�L�%�̈́���;-G,6�^�I �&/�.�j=��t���Ĩt+�fVIO;u3�:�L/ɭ͞*n��,`���h:K����Ch�1d�͗��\(Q���Z�X8�u�!d��u�����M���'FM�[�7�Rr�c|g���1����'�QO�$
$�)� pt	���W�tY���#��o�-�T�E���a�;۲�3��{3{�7k\�M��q{�YJ!$iޯZ�XhJ��+<�Tӧ�Q����_�;�|�7��64������YG��v��p��#�cF8�QvI	��K}qV!�Z��ЭT6�6�{�T$��J���Wn�jV�s�O9ujz��:��J��v k�bOa�y�M��Ad�L�X�<�ЀzBY龓�_���8�d����Ĩ)�S�����(�t쪶� I��:2�DziP�+5�lp�.?2!��� r�����/�N�U�3vJ��7�0Wy�0�����95Ꞁ��(�c)穾/�#���ٙ�;��jy��T^�t�+�!�bKG$%��H�
&��!LN�Z�AwD���$�_�I�"M�O�c�_�y	�Y�Z��p�z,��#�$�b�~�Û�#��
���U���k��Vt�UwyB
���+:Ѫr�5|U`��IW�
!_�xۆ�hU$���A�U��Ѫ��5�g>b�	�*�dU$x���C+���A�p�=_������ή�U?L����[V.|X��
� ���Ń�J��B�����U��t�§���s��FxC��7�PW+�v{+��� C<N���;���љgL���]�.��|�������n�Y����vz�[�@�!B'����z1���/����\��>_�rp����.���G�D��JV���<1z�F8��\�o���n��Kܒ_]�����<E\6%���Q���@30�dj��k�y{6:��]�L1fM�ؘ�e���lM�u'˝�'N�ڄ�!w������BouCh�bٗ�փW���r4��:�s.    ®�t�r�bFͦ@�0M�˔�a'��SS*z��Ĩ	4�fcw=��fj�Z�����w����'FM���0�Z�
ͦ(OD[�ՙ?R�霔�͆��Ę���یf��P�W
L��
3�ԉGb�	ͧQG�y�=�&�!f�֠�Y�nК�e��ht�zFRӣ�վ�6�i9b��#�R�B�]����;�H>��?;-G,���%��]7����l��B���'FM��$��ĝ�缤S�x6)��U���T��$�K�Z�+�|.�j��vZ�XlG3���Kp�����ݞc���!��|k��=YQ���zĚ\v�胊Qk�~/��<1f��n3�D���rʹ-�Z��،�CX��u�0�I�)-�#b�	�U��&�,�M�sS�3g��8qKCS� 'ޣ�P����1n,`��q�ݵ+���k���E�R#R��@��6�-�a�)����t�y����Z3t��:Ѽ����[g���t�Lxγ��/�J��剅S�I5�LQSU�U"��
�Ӭ5��'��8�ᮧ�cN��s�f�T��N����B��Qɔ7ui�<����B�cv�4�ͧ�zϘ��NB_��Z�XhB��H�溰��y/J�f�fF���5����Ţ�1�3o�1���cŌYi�b��������#�����Jb����IgChyb�	ͧ��&sxb���^ܿ�(T*-S��q�:�|
�lO����3X��\2��'ZPǲ�青�M�w��/=��l �<1j͗�gp���y��h�����.-�#[�cIc����|T����b�7U���*�Z���ܟ/�� Z����o�.�S%56MRz����]�䉅4�¤@��\uwId�K�N<C��>	^j-�2.eJ��f>��^j�v�.�A�o8���f��+q��`j͊N�f��Btx�a�@��$m����'&��!Y�^�{[�����ƘP��/�vN^�w��HA��Ѵ����>�O谴~Ѵ��2�֡��X`������]{+w2s��oU%�sg�ב�r��r��X��+�mTŊ�A�zx� �-$?��s�^�@h9b<C���"��kL�@n�A�n����
��8Xz�dN�hAwPdA��@Wt��=:/�'/�Zщr���J���Wt�\�p�	tce[+:Q.v`�1l �r̰L1jV!�X!���֞��D)�Q��9��(e;�7��ʸ��eV�.�KÏ�ȥ$���[��K��g08Zщ\J��O�W��$.E>r�CA�AR>c$�(�3�x\�I�Qbgܧ)c�	⌏ztG�h�X=�N�)�܏��јxB�x
#�S�#!��j���SL�wBt��@R_�)��S#�����:+��
�,�1]'��!��J<����O�OaE��	w���`b d;_�QkE]7/5g�,;��P�{���!Ƭ@"����Ŋ�1n����h~��H$c;�W���]]��B��O$�	�O)��q�N>v���c㻵]����k
8�ƚ���q�.��e0�?��}�[tY��e�Z�Uq�tZ�*�Xc�4��R��Q��N��sL�O;�6y��=r/)���M���r+<#Y������X�x��E�J>��g�F�}� 	��[��������u��i�D���>� ^iČ[��2�y3�i�܊6�Ĩ�	~�ه()�&:��r!Z��⠯k]2�ݴ��������n��#�X�͈Z`F=��P�Mgg��]����Q3�>��V`F=�S���+t9.Đj���)Ƭ�{�6Vx�T�Lh
<ń�!�7�l�����cF�,LJ!FNZ�3�SemF�,����RC��k�ཡ�<qoz ]�<6f��i�g�#+\E�$ܝ�'F͠�6f�F���L?ir~P1�sӂ�e�13�q���a���5G���#�Z�5�n�ט!�~�i��V:}��$�(6}yh1b�A�ڌ,X�Mǻ��{����Vyϕ�'F��;;5VHVx����[�N��jZ�h��yJ,��՘!XVU�`i��;hIk-C,�Ҙ!X�.漶g�z�(%O�Yq�D��"(�ʰ5{\EM�Ci�n}��r�e�13�1���a���Z�X�2��Q3���g�z��y���U|[i9bqǕ��
u��D��;W��W�TZ��3㰃Fm����\��l�9���r���'F͠I�3k�5��S�D록I�^J�cf������&������G������)FNXJ]�7�����ח���>=<��F({����1e����p�O��7�syA̜�ڦ�6�\]���7�j�4��e$��{�\�>�(�|OxsQ���ؕ`��e�!�%�����\�̛@�e�a��e�'����5_6j��熢l/.�{��g�B�kV*�i7�b�Z����~��O������n+s���{Ż�=|k֥�	��m�NZ�Ng#Q���ѐ�n�o��o�����y�k@l;���(���o�����pw�|��}z|��~��H��y:��iA9�K�(?�Jnz\Y�bn���Iq�voq1� �&�D��H*R�ڠ[��m�"�C�?^8�� �\���Hp�w/@������>)p�����2΋�i��l�!�� �s.82'��ԝ�b9Ӄ�9O7"��s��s.������9��E'���8x�й���J ������'F�J�uxw�*c�Ec��֛1ƚutb��M��d���K֬��p=8�?��[��Y������~��"G��6'8�\_9J�zG�e�D�!�:�Qb�~��2WBWՐ�0?׉!|Q=8�+�)Hp����0r�b���	rp����0r}��E�dz����\'���#�,ڃ�M�H3��Q�-8�-_Hp#͜Vp�sU�:��fN8���W�r���	��p���9��-:/���M�Vt��C's�\-+�c�ߢ.��&M+�c�ߡ�ϻ!&�ݱ�o�	��&M[P/`:�u7;5�fKׯӤD�<1�4�hR���Dt	��2���]�W��<�)#� 2p��x��#�s��Q5_ط/Y3�\����C�O���i9bv��r��~��Pf��Y���@"vL5E�N��;4C��;~���>���5��N�cVp�7I5��mzq;%�xإl*�q���h9b1�vc������lcL���Ĩ4-wc��"�����O�����e�1+h���
�ʰ
K����5��N����k��<s�����)� :'�Q��I�����\3�l�A	ַ�_�T���LL�C��:��v���M��`aXW�S��D�Z�yQZ�XL�ژ!p}6`�2�3h
�QO/Z�3�ffn̐,p�zٔ�V���%=^�Lqg�!�q��%Y��Ě+�̽O��Y�STZ�5��ݭ�)���Tpu��J�kd�	-G��5S��|��|����w̺3�g���+*-G,�������I���/�D|o���Գ�/Z�;��4}y=�/o�>rFSQ9�����'ZP�����g>�J0E�͐;���E�M��W/s
RL������Ѫ�p�@�h8�BA'�-tu<=�Xr{�Ԕ]���oo��������l.�pH�hP{�~&}�q�;���YS�H����OӔz�|����pnjO���9z�5��'�1��5�f�/��_����)��xr�F�3hyb�)өi�Ǜ�ɢ0��I=q�h(��V��QZ�3cM�����J��L�P�l:��0�;-O̵a��i�v�����3Ӆ��s�3��&�<1f�A��jGr����g~������O��N��"��Vp`r�ѷ�
�l���t�:1Qѝ�<��?�wW����a������E'~Y#b^���w�d��D�+��G���}��yE'{oͲ|�a"�����f���N��:�{�"X^щ�[�"�ItC�+:�{�����
N���|C"X^щ<�45v�`yE'�P�Ѝ,��D�B��;L����
/ދ���Wp"O!�+fX^�9���V�e��Wt2OA3�    ���Wt2O��b�ayE'�rW1ư����
a��0��N�*�ac�+:���g��1,��d��n���3H�&������\�006ȃ&������\�>�D7D�<�!����4���I5I�#N^����tu6�q���vע#	$ItC��+��]�.��n�8yEwc�kё��$�!��ݍ��A�'a�"N^����Zt�5;D��$��rJ���?������[�Ӯ���C�U��l�x9(��i薕�+�B�9�6�W�Ύ&M�n�49��nκ=<O�&���H�7x7�]�8����&o�n����g�(
���4�U�	�^�!�O1m��ι���o�F7�W���}m�U$��o�4�Or	a�5��b,�#����[�1:��t��&�4�З��SH	Hk�B<B9��8��Jo@X�[k��5���`3 p�K�����`:�e亯�C�f�V��撦T��U�1j@_�m� �"��x3�ݹ[b��q�N[��}J߼e@��߶M�mW}`�0�Y�A٩������bԀCZ�� �6��9E��%��q�i9�:�w?�F>G�86`�}�Z��k���pl����ut/B
�w���/Z�gj���Vl����=h�m+vʰ��~�T�!����عL�7l�t�(5�C�0n8h�p�Ӄ|.�#Ir`#d0��8h�J!�؀q�������A8�-�6B���:���_l�\c�u��%l�Yc�un`�a�؀q�s��?¨1sƒ���ti�l��ؐ�˲E&���\2r]v�ds��bCF.��lasTl�ȕ�"�sCHdC�2riv�d{�pZ�̑AY��-�l,�vCFFe2�1�O�!#��B"ʥݐ��Y�L�k���n��>��w����-{�ܲ;���!���2���{v y���R؜���ݹz`�G�!F��8x��l/ƹdl��P��ń�����ۋ�%$�����JI����WU�R��~O�V
 �d�*T� �v���%A���%a�ތ�ߓQdZ�,�_3c_����(2#@����F� ���Ef%�	� ���~��r\��e��A�s��Y��\�w�|��ty}==|x{�������0/T�������Ǉ�~����Cq,�\ �Q<�Χ ��b�C��FI�C�!~]%�,���/9�OL�[11�J|9g�/�����7���C���I�Ce3D��!E�/��"�m�6�K�yÁeLߠ�c8TN�~f�2�gu�5��8���B����n����D-]��ԥ�&���c_I�OfC��z���)���B6V��!c�H�5�$�����F�&�'���m��7R�\���g2��Ac'�P�ކ�{���`��nȸ�94g;	l�DoƽΑ�����:�	s��K�6d\��z�=��,p]��S��mȸ.�Y�
�86d\���^õx2�fzG@3�`����y�� Y
E!+rې��l�,�)$����ѶȲ�Pqۆ��hd��1"��m�荶Af���j�V`��g[`�!�gې��l�L>�1w���5���U�c�U;9 H/��R�+��A�C�N�9��خ�h�@����"��5����M�m�p1��ӻ1�e,#)K�~.��s	^(��Þ%$O��.}U�?�r�c�y��)3��r	{�C���<�L��g��=ˡ���aCf%O�Yu����A�������$O��'�nT2nx��)3ﻓ���{E&y��=�q�j�Ꮩ��G�I3�������*�L�i`.���?ˣ�$ ���{����B&� �`Ȱ1��%L�!s�x�~~yz|���]���4�+}�zf�7���G���"tVa74��I��(C�����q�m1tY�N��׊�3Z�?F�� ��������1:�*�N�(���ctܜ�lu��ҝ�&6�M�lu�ւ�&�)��I 3]H�][bb�㇔��[�販d�>�(2~HY~}�c�Q5Ȱ`��D��C�������A��BG��C���c׵�Q5Ȱ`�S��!e���8 l�ީJ��]�)�Y+∼�d������{�uU�9|%�n�T��[�r�6m���P܅*�It��/�f<�tfl�453
)F�8��Y�8�ћA���V�?<�G��Y�?�@W)�:eS5���=]_�H����Ө�ÎF��B&�4��4��ؽJQd�x��Sk\x������hA�'/��-*�L-�HY���xY�^-��S�j�q{���$��-�/�G
�/�ś>�t{E�I"C�d����NL!���ƒslQ5��ݟ�W�$����a#�����/����l'c7�E�I�~C�����-v1dA��:�7X�n��"������-ã#XV�L��۾�_�j��?�a$Hvk�y��d��=�����g��A��j�"�x K�IX�N}��":d�e%/l��'�����#�5�U��� Bq�X��
1�����ġ"�b(C������X,
(�Ci�+ā�r�Վ�8�%�BX.و!e����E^�7� �.(�C˷^ j�R�:*q�Pv��$�JI���!����J��Z��D8D�"�*t9������+زE�.����{b /?�*6PZ�ͅ���Fj]6֙�����x�|5�
�HtQfF��{[3p1j�1I�z�$7;�~k��[#��ԉ�C�B�	���ԃ�9�����g����7FQ��KBx�G���\�
)F�8&*_�#��J�t���o����0�L��æ���a�v�;F�%e��%a����ritF	�����8������
;� ǥ���V��y��X��.
'^l��pQ��>��q�tV�(P��Ctl��pQ,z?F�e#��	��w��[�ߡ�(P�f#�����?k���N�� yG�M��J�݈[<���L�FXt�? uR�{�3�Sd`�T�[<���4J���&�U�{���8����>��:�I�zЬ�4J^!)�U���։�*y�t�Pd�{Z'&>����Ӕz��ݳ}P����6U3p�s_'�>���Qu���A�]tb�
���Aw6�u=�>�a	C7>ѐo�����~�K��R������o��NaQ5?+�8�b���4��o��u�g��Y���%7U���z�ʡAX��R����q���jy�	��Ag��ZA|�g��b��ZQ\#�~�����8<����%�T͚Ѕ�[�����5"U���Y:<E���b&p��0��v�z 7����=���}�$w��4��v�P{ ���U�M@�c;�y�P���S���d�Iؼ�l���,XJ�L\T6�J�M��H����Y	�J�M�R"��E�`0���d^!Ӊ��O�q�tز�/d�*'�e92����/dC��E�`���d~!;��:�
Xzl2����*���&�`���B	�Hl�����d~ab�'�El�	�Xzl2��3����JZ���c��V��o���Y	KsJuI�] ���Z2.9`y�GM�J�uY[�!�Ļ��Hݞo��H(�/����)jdB���4|��><<M�#^/�8 g�ɏ�~���cY��L�R������� V�n��D��p���^�&��˅��=|���x�͝�h`�(����{�D�����-��SNئD��ܩ6%�]q�6%j�ߖ�Q�d��Ge�y�0j!@�� p��}� �./8@3J}��w���<�{zx=�9g�d���c��iuc��X��K�M��Y�3��Ę�P�����N�O�����/OG�����������Ϯl�%8�|||{x��~x~9i��������0�~�*��n���
x=#ѻ�i�'�.�7�W�JYi/]��eȖ�X[�9]ej�b��'�"y�V�~z��lqV۱�d$�
Ym��=������v�F���4�p�����tb=$A�
s���%�g4���H����2�+;K���0zȣ�f���<,����!�0N���Z`
��҉a����	_�Á$�a�    �FI�rB��x�a	�F�X�лF�Vs~�F�KSq:ޚ{M���b~�x��5�:|��a��h�wk�5�2�A��7To�N��$�	%�v�k����o6�D:�Z�؉��P����ފ�Z|(��!��J�߭���'ژ%�3Zck�VL��3��+����
�:|��JR�Su�^�[QU�O�5�Ѭl�nEU<Q����ۆO���e��:���Iw������B
n�I�q��q�m��
˷�<#�{-��fb&qq�C',.C�;��q{Bb�y��nl���S��4lf����d��oT�����#}���T]x�M�� O[�{t��y��mִ3Jk��KhL��'�KvJ�V��d��N	��o�Z�d����_�jf���_��Oi{�H[@�c�d� ��-XT6�w�M�٢�u��l���,'C{�9,�����&{h��E�l�w�L�n(4��jS5�d�=6��י�a�T6�w�M��IkOX�{l2ORX{��Z@��c�yC��o������&�
�����(I9a����L.�V�7�5�%�0�m2Qd�gs�Ð�i��D����3@��Y�	=V'f}��N�F�ה���o��O��9�i{h�������,�F��N*ad��0⃺���ÇO������������������OƔO|��t��9���ת&ho��g����,�F\�&*��f����]�X�McJ&���CS���I��!c��;.���ݭ�5ѻ�?do��/����ǲ�~~j܌����^�{��q?Q�	PVY���Q�����~�G�f�1q3)�	w�%m�ZU|8�C��%jHw��o��._��]>�����>���}x~z{)k�������t9�=��^��^.�߾���ՄQ���;{N[���������l�f;T����n����?0�ҧ':��w.?U�Ȼq�I���Occ��>����(|C��+�,}zBi��S+>���P��_� O�Y���������O�V�ŏcl2m���,}�}�ѽo�D^>�ڵ��XV��O��x������G�'��<Ai���,��O�����o�D���R%�����(��(��l>��D������E]�1��Ԕ9R� B��~uut`�����G`������}�� t�s`�4��~X|�������)-�(�G��]|`|�>
���A��)>,>��v���W��߽<�|�k7,�r^�[4�|�Esnw�R���9��Q�������E)X1�Uz3Ji�Y)<,H����gn+�)�LQ�[[��]��"�����\ϝ�|Tw����v��\�����痷�����˟O�?=~��^=m�t��vO��ܚ$�4��-Z:S`ڠ�]��x2��~<�t4q�����Ǥ�ۻ�>���}=������������??�	�;^?|�|��I �W����}�5q�|�sAt���'��jvwAA2���j��N���������P[q��i�f�-��̈���fFh�
��N�ǉ#'�ǽ	�g-�?����J:���q�TC�z�T6AW��,��Pݞ7U�M�W��&K5 ��z�K���l����C���>��޲=6Y��5����j�	����d���v�T6A��,���i7K��t�m���䟞�:=>�=���<�py}}~y=�����Ƿ��������H�I�&�@���p�DJ��%�w{t��w�=:�hv��]^�_?<^�>\@ryy*8������~z�����T�_>�}���r��)����D]B�90��w�N]��a�X�X�{�	)��L��I������L/�-cA�����::����U��=6��u���Nw�T�~��&s�Β�vQ5�:lǝbz ���[z<��d���n��nC�H��&s����\���Z)��d��%z�%l�	���d^������ה�+��������Sq����M��{b�攛��
��Z+Z0��Lމ���0�����IA�?|}y�KG�U����3,g�Ր�B�+�-O��.��y��tϤ]^=��\޼>����p�C����%n���r�n>���J�4_%|���RB>H����G�}��D���jҲ��F��}7?i��_��篧�=|<��������zy{����������7�O%�=cg��Sf(�;��)�s� 1����������gȒ� �K����]>?���ș������!f�û��ٻ�~el�n������o/�.���,jM��Fo�H��)/�L����d����#�d�����{-0�O�S�޷hw��o�1Yf�e� #���Ï�ӏ�/�O�'pz����s�¨�5Ld=':j�~޺`��~��o8��n��c�IUwqV|��N�a�C�)F�JЋ���},��+���� ���[6�J��a4o4�5������?=|���������_�k>GW�2�W\1ea9T]{������п��yg~�6�Npa5��w���	�ZƜ�-������I�.��6� �()*�K�v�}��H�'t�U�IAWV�������� F-#g	F CRH+6�{7��3��|X��6%�h�@5gQ�~.#x���/k��&�$��*���\F�f\͗��08+��G���X��AC��ݼ�d�a�B1�51�����n�U�������*�1E������s�o����٤�"]����dI�⛾�\�b�Rq�Z�B��K<GMn���n� ���57��ٸ����V�L�,�ǉ��5�>;En�qNP܂��Zzv�.l���`]L�3=8D5A����Y��V���xͧUgC\~�망/�fב]����Ɯz�����o���;hy�a@3�}�B�c�eSNV�Ѧ	 �4�Dv1��Z���v�t��kŻ���?���܆!�8�_�״�5��ϻ����������[��ӧ���xi�P*�O}NGI��t}%���qs�;�#���]cS-×�AQ�o�+u�� �����wԚ�7^{� &�x��G cs]���@��ѹ� �`:�[  �� ��|�HSW�N���� 8ƚ��R���1��`��G�e8�A���-?��� q�
�k� ǨSW�BO⏘{	�cܩ@#�$���{�
P�I�0����&�FY$F�I�h |c��+>�#�G��1���БL�eB�c�+@�#�N���HV�RG�Ļ� �
P�H�x��AXJ��2�<+@�#���AX�Y�9j�A #BXJ��_�8Ƅ����(�e�V�RG���
P�H�|�#CXJI��A6��ԑuH��!� ������v�a(t$ံ�8F��:����eD�k������k��Y���V� %�
��6�<Ȟ" �q"� on3�}�2�)�
��6�<H�" ��"� o��`���������8	��m�=��L؜�$���4��7���W�K�i�О���X?�jiy���c�PYiy�f�o���_�P����燧�߾��<@��^>�o�+��Q�l��9n��SګҐ�n���#���1q�9L�p�7���)�t]����W瘜�3_vZ�X�Q��js��u��o	K�b�'�<�В*' ���Y�@ug�L�̆:��x�~b���$��{���u6���&ԉA7�����v۫*˵���s]���r���O JP����� �f,��0�l�u���#Ƴ@��Ae�,P��7��5\�SS���ƃ�1ǒ�9`y"�Q�lM���*;F8��1��e�M��8B$R�Ye�J������Q��C������t���������燷e�}zy���ӟ//����Q3E�N����~��7f��߳	�u��� ���yހ��-j7�%�����g����Z�8<c�����]N�?`��q�@�8嬍۪�~��{}��97����L9 ��L)�7���Qu��Ř)���
�7%�B�n\-��z�u����B򞗄�5x��0�����b�9)I�x�����t�@��{2e\/�    ����1�i��,��O�	�M�_�PS��ޕ���5��/Mo����g�ޔ��������X�{����~�ӂ��0H�]/T�(a� B9D$Ǯ�|��:c f��l "Yv�`�S��u���'!��ʮ��DST�G�eW�{�A�1	ߛL�7���ޔ�N��{������af K�q��rx���Ď�3�vqX읚�Òc����-��.���4�%/ܜr}�t�F�wBv�	%:i���Ŋ�`����B)�!b���+W=�/t�K���9�N���Ɏx!�%	s��F�7���� &D�Qvb��o:v�e�m���9�N�؇v�e:ߖ��9�N��Mg�e�c	q��e&R����HgEg�4�r�A����@q(�L�]'����-I��KeV�W�a�y��j�c���#�Db*�Y1r�e�Qr�̬9޲�(š��!�Y�c��~0�ָ��*���帾fyP�e+���������gռ���*Ć�n�d�k������ׇ�fd)��@�gᚺR���A
t�mr:�Z�5��I�bٻ�eؗ���u�6<�f�l^��cI�mt�2ŘH1�|�\��}�||�p�:� � ��)�����e�evL�q����`VuO����^O��QZ�XfE�n`���{������՝��.J�XhA�m�����w�=c��j���'R��go$������L�~{�iyb�{�TN~�E�@*�*��c�剅v\��D�a�4��T�17�ƢZ�XhʞN#C�0�`P�����]F.n�U��/�.��K)*Nٔ`���n�,Z�Xh��}%���C��u�*�J�_?��'�R�+ye�ߢn���:O�8@Eiyb���3E�k�/,�h��7VH�,��Z�XhG��c�l�7�l��B��ȡ�����BS�	��.�p�%���kCiyb�5��>cVL���4�)��L&Miyb�	MP�DAU�RgH���&5��U��hb*'��,aG�q}L���B��B;��:a,���'�1��:iyb�)U,����ͧnt��⽃,mz��hyb�6U����?�%h8��&��.~�� ho�/����2-���݊�;.~�*Y;� X�vOwk���6�����}��J��vt���-w�=(��~��%�V�T.SOZ�o��Q�h,Z��1�NLJ��A�L�s��{�&)��ѕ�n�>W�l7L3��9s�[�Z��<�4�b�-v��8D6�bx��4��q�oh�8�"���v�rh�8�"�-�f�1iM��"�bԖcv�Ŗ8�r�i r���V�/wtQ:	q��h�8�p���h�V�#OwN��7�T��x���r}���nWoRp��N8�zQ)�qX��	��l����O=�1�x�TZ1�x� ~�cUZ1�x� �ǘ�V�#SXv3L��b��D�a~�c�ª�a���'��+��,�G\�<_i�hi�8�
��Jc\K+�?��kf�ni�8�g�p�?�`���5�K+�?ch"]���z�� �%�7dS�<����2�ZJ��B�*��+�|1k�X=����':i�)-S,3�z1+^��Ҏ5��2>;�&)��ef4-N��S��n�@U�V���MY�<���4f���&�3y�)a�:�#�-$B,�̓��>���9��v�\�<�Є��̊�|7�gL���Է�~�Ҽ�Yы�ȝ�1���Ϊ剅f4IHV���	;|9#疞�剅v4IHV��G��x���z�&��B,4�y�3����MY�R�\��{�[��x����|T�HDW��
���y*Z��߷r��l�VT��1ս-a t�5��N���?&�`�u�&	}�ۓ0�%j5v��3� Eh9b,��Ϧ >\e��Z��Ѐu:�-G,5�v�e��-}�5�t��١8Ohyb��6}�xk"��d}�*L7�U8��OE���k��Ԅ��m��a$�5��3�gH.�!�=&B�#v �b��NlJp��:�ߑ�����Sp�3r�2�23����B5��H8��Ϩ���j�b��m�b�>U���мڛi�����,�}#�J�w�t��ӭ�b�EUn�,b���|�<�csL6fB�KM��������͞��N��-G!�	-O�ځͮԮskʱ�������ϧ�������ۧӇO/[l��'� ���k���7;��^�Sv����'j'���tw�I�1VS��}�M����s��bʫ	�]Y��0>�K}������}���;��3[&����ޢe��/����o��&����??���n[�n}%v��\sd�*9b~��|�榋���?�aC�ŉ�T�7Y�����Q�O!	Nu��|�q�^��F�;4MZ���D�c�Lƴ7��4��i�n�E����ڂ����=��;��ͼ�~��ZkuC����ч��1x�Bk
�sO�X+�#�m��Xo7,�C�V����#I�Objh�`��#�ɮ$ơ�+F��r��6̯��}'�����#�I*e�P�#�m����k{��tM���=�qy��졲Pr�5{�z]n@Z�9F���dz�
$�O9��!��$��T �o6 �x�?칎i@27�=H��M;Q �q��Q[���u|@�o����Z�7�./�i9b�Y�O���kb�����/%����̣R�5B��ŗ��g���q����;�|'	�Q8:Rn�uW-G���t���We�P��?|}y�˭�6wV�����g<�Y�����K�j��?���[�wz~�	.��>���<<��B����(���ʧV��i��T�r�/�/������=���)��.���774O�e����������o�}���������]�k�x�g;�:��P����e��d�K���`'6S�Ο>n�c2�����������o�����U�YMO�)b�]�4��[����,L�~��߀�
�a�1:n���s2tuM$74�ЙlW&s^��x����9��jF���'F�&�.6��V")=��ަ���F���ZNٲMZ��kÜ4��2�@��j�����D��ͅf�	qώF�Z%�:[E~��i9����tS�a��S�I�֫j��i9b����p[��Fx�.O�߸W63��n�->��n}�=;�S$�����nu���%Ly��~.��׏�#������HW:����������qz{���Z��8&�.����������7������%�~8��������tSqs��ľ�G���i���׿�;�T[T	R�ʇ�����������RP_^���M��ebYUv#:4(e�}�9
;��ҝx����)4�w� �`g�I�ǧ?���B��{��[b��l���8�-�Q�d��P��޵]}�L�i����Bx�.����HX�	�^:�4����GX�Y)<:���7�a���]�B�i����BxtGw�HK�^�c,��� e�N�]7\�Yq�a�"J��� �Aꄰ�KBx%>(��.+<�s9b����t@X�e�s�J�q�,�]��)�y~��O?���|js�SԆ;ɩ��_��6~���M��/#<E���:=��J���o�_N~�xy>���/p�y-]ΙD(i,XRxvw:��62_v�п���CNo�3���(��j�����f�U?��<1v��º]�te�	��>Rn��=�hc�����h�̎*�?���o�~��R�zy~�����5�(�)o��f�a�=��U^'N�N�Q��׷�z)������燧���.��Y7K2��rR���fP�ڇЃ���r� �q���9�2v+u�l!�����������e�y==>�>?��&�YKa�1��X��j��ٟ��yY�#����n� 3�{d�E��6��A�l��Khy�~�v�y��i�u	�����S���X@&'�6�}�r��W���L]A�u��;?�D���>�}��J�wVt�Ɋ��j�-�*���Y~;�M{����߀.��e��87�Cg�w�V ���4稫@TSsf����ӐTZ��Y��6Hrw	)��6��ޟ�b�[�|O۳�[o<��    �)���t��/ӵ2��?]�>|����]�l	1��q�T۰B��o=�,������j����WǱ��̔m�]���ww��g �:&��>m�^C��mL���?|�R�>L��?<��~����\T?���������:ۧ�] X<��'K4Ú|�?4$9��[�����6S�����ߐv�õ�[
��_S�_S�1$�����c�s�;ZT�cHl*lh1ϊ���<by�KIH�[�vy5��J��Q��)�4I��T gI��5-%��ȫ2]J�Gi�b��$x1��P���& /��Վ�;�&鄆��*$_j>���|@!H]�t�\o�����/�F:P������{/o���
Oxџ(,)x#�'Wx���H����?�k���F:N���w�Vߛ\���g��$�n�A��gil4��)F��n�S������oe���R7G! �ó�l<c���QSU����bԌ�ɯ�	��EfF��e��O�K�e���gx�����?���gb���z ��:�?�߮���:�?��՝�@��c=�P���W��[=���y��^��V����_��VOݎ�r�^��_��$�2x���~�����^?��������z������x
.��P����6\�8��:#A籄�ctCu�:�D>;w�r��Gg]��;V��C���krA%�YOK��]ߺ�����m� }Ag��j����N�ݮ����Ig���Q�
�<�IFy�3CU��(�[���W����mک����� )F�8.\��v����͎���>����k�. ��i;����r� ��h�B �v��E�U���_��k�"M��Zr��ż.�:���ʹ��g���_���0F�~�1�#o���Q�����)MM�^N=��{#�W*�tȪ5�ϒW�i��+""ZQ��F��e���8�D�7�7�`�����#f'ͨ�ʨ-�� I�1A�Xb��mM����Ę!<��ϑ�����;��^�+a�>u�䡘pO!�ifB�h����=���1j��t�n?Gv�)�cײ�]�16�Z[�N��Mqe? Gܿ���O�0ڗ�/�_Q�j����;+K��\u��f�V�D#���w(Ǔ����Pg ����������Ƿ���\~����?A���O$�ظ%����"�S�����V^�y#U1y�5�T�W�����������r*_�K��?~{}{���bR�5�R-u����ܰ�8c4%h�w�}e�����9Ө^�?ꍿ9B?��������P���wZ�o��EO�?�𛣅�><����q��� J�)Y�~W"Ž��I`�Ps-�c1����������uʾ*;��X��g�̚\�XT��>դ��t1�|Ty��k�'�����?>�{��^���HW�>'���*�þȴMI�NW��wOI�Ŏ<��'$Q����}{|�@���.ON��R���3�Q���nJ��ECD?}�p��ݾ4�i��ܒC��5fnV�x_�����xl��ںp:h{L=����;
��a`F���>&Gh9b��D�����+���q����H�w������
�1��[���"��$�^L�OgCg �xg�[˝�'��}�����J���Ȏ=�H�IjVW�J%��w4��'F�OWi�p�WUl�1��=~[3p��{X���Rgt��x�2��;s�I��5��=��߀r�,��K����i=�}�V���E���k;Ӹ�p����4�2���� f�Y�|�����k1/���e�?��].طq���~�6L�����teؿ~.����^>����R��fH9s��=�c�c¯ޯ*`�}�^{���* +U�a`���[�@t��w����-��~zFX�����N�F��*;]�@�����4׫��o:��qw�Oa�;WaF�^XoC�[��f9�fu��(ԝ�(H9��n�{E��/�ݮz���ɪ�kJ�e�%��Z��օ^�<1j
R"�����g/(oM���\0��Y�h�e�34b���'�ҝ�R{���j3f�����l�����,���##��#'ݴn���3.&��"��n�.��F�zHr�ZL&g���k�H���N�n,�ߒ�>���;2�s1�#��o������峧���6췷�9�q��e�m��G��a/��BO'�]��?n��:ӳ�U	�}������D(s��i1����mC�y��+frLG��7TX��}�L�I�PY*�ŨFr�7T����O"Q���o�<�%/�IT#��*��,y_H�� �P���@��;������Y}C��?fi��'z���ӡ��U����l����
�t�D5������ :u�D5�������(��)�*����s���#�kP���o�x. 7�����d�yS�QY�J��k�O׷�t5�އ��.�ݞViy��L�ܯk���S7Sy�W��C��9E�F��tV^�Hh#G���v�	��6�K�5)�)�#���G�W�y0ޫ@h9b��?v��qK"��l��*��z2e�Ã��>u	���'��W��lVRuW�p5�>�w���YǊ>��r����*#�o��c���v��;Gg���=K,5cOdU��]}���-���&_:�L=�uP�T�%;-S��SX��6�`}����_?=�=�^߾}|���>L�6�� ����X����y�͎i�3a:�to~a�u�u�4��S�I�23%}�zz�{O؜�>�~z��������������dմ)�]�?]�	�r�.�eQ������H�|�=���t��+t7�P�~1z�:��/OM�n�Z�����I,k�{�X�S������7�O��4e����i@�O��o�?t�j��n�þ�L�TޝH��s���ʝ�ؐ��}�ۉ������O����Ǉ���q�|�篗��q�/�q�!K�נ2͠�N��_~0�;�[�}����X�u�u��wϧ���խ�uS�V��b�L0J��e��x���.rĸ	��	��9%�*��r��L�<㿾=<���,C� A9�{\2���G6�Ĩ=�i[ŏ�ٌ5���R�[h�Kh�ٗ TJ���oi5_-T=�R1D��
	ڧE��.���'�Q%�D������Oy�z�A.�l�����!��5��P��)�ǚ{U}ZTL�M,g���e���	:$c����E|��/���C�n#^(�S֒���������dZ�+ۼ<_�<1�#<�
�O@����qa�8���)$o	%GLd��=��]�[�arid$��?�b���p�c��"kD�,�oĤP�|@�������T�Ij ��2f��ēN�V4LT�	WP��7LT�I(c��|#�7�T�	�Wr�?���6{`�3�Ѽ���!e��%�Fֈ
� ^�?����Q������eSd�|8�D�4�e�_,����'Ƽ}�ǭ���|Mʞ�L���?�~||Y�@?<?>}z�I����Ҕ��҇�P<juh�~�N�kĻ�t� �K�8ݣ������t�q�Q�*w6̗`C����Kl|p9����OA܉����o�$�������1?&<|����=}�4�ߝ����/R�Qh0�l}��Y����� ��?�\WNmp��/�������.�վ��M*�����v˕�8���)d{3W}��?��쮞ٵ.����i[��e��R��2IQ�9O���q�� 'r*�k�>�I���� ��T�R1KH�����>��x�-�\����Cg��l��>h5	qyhpZ��w�J薜�!��I�'��7�I���a����)}�4:��RT��w�޺�I]:d�:�B���:�ChU7����]��U�l�e�FD�1�G��!�s����k�m�w-w���gp�>a��f�'&�Mc������)y#�`q["�Y�v.{�i�e�o�<�0Ё�(/{�J�߳.��]�6��(G,�@�ܾ�@����SؓG�gOn'���d�	l�_�xP�[Jư_�s�O�\f�)���k,���ģ    �S�{}�.������>Ͻ|z"�����n����$���6)>R-Z�g��$�l����9�'��T���mN(4ܰ^�֒Vw��U���|yz},�
w�o�g�}%�)����ͳ=e꿰O�c��Ӷ����?,v���{���/��O?�>�V��������3��,Yi*����Є�,}�nJh}��*�/�i���m�v@���JNRr����
��f����X(����Xp�e��4����=��	����=��x��y]z2-P.�{^C^th;z~�r��]Ί�e����ߡ�I�f}���o��M��������t�rP�8}�4J;��ch�^����?Y��mr�8-t�ѣ����������6Ҧk��Ǘd�0���o0��*f�wm����̆צ�4����{�b|��ǀOvBÏF|W|�!cӵ�_����V|W|CަkO>���J\��L�'���-UƸ�<�r~I���y�>��u�n"��7>SB�!
Ӯ�)н��:ZC�yL�p�*����ʩg�L�IP�`�,C��t����V�r�2�*b��%c����y�\��rćx�� ��F3od����ۡb����m�e���v��ܜ��/2��Ɣ��@f���_�����Vc�`�Dv���F-��������k-amYh81�r��J>��a6��c��a��,6��b邤"�͡�� *� �=;�T��:��z�ɇZ�)�,Hz�8����T�42\h�'&�D�d]?�y�9�T2�����/�rm̓Q��Tc��y�]\#�����Z������H�����nIC���l�߯�7&0��
-)�<h��<xMU����?y�Di/?߿������G��{իl����W��EH��)���d2x35���7�/����V	�f��}?�o	�^���p������.�8��X7���Ku�'�F��f��a��Y6�ɣ^�MG�w�B��������m�zH>0i/h�p��<җM����-#��XaEq�O�됝3�f:�yw�I������	�9\y&�`2w���1���g�����֔D�F���L�ǿ=w��������S��R~p��OF�?���)xR��ص�x3�ۢ�FJ�����x-">����Wo"^<�_F˒0�@ϐ/gx�χ��~x���oO�z㷗�_;����R@5��l�'��Ǐ�Y^�������7�"+���Υ�гcϡnkZ}���<Ӽ�G8�S�{���>FK�Xblde�W�$��dێ3-_m�6ܚD�<�LT_U��	�^h9�'��'3?�l9%0}��d"�����.�~>QT`B��n�׻�m.�zB#_����n���y�֥9~���w,�l��(u�C�A1czj8�em���,���'�[p]&�0'�������pK{��]��bR���o���\7�-�w�8�=(�jO|��S��wJk�qS)������$�iF9bv�C���p���^�^~z!/�m)�K(XQ�m�-�=R�B��Ĕ�G��Y���]�)���C ʙD��na~֓Q�X�
JJL:P=߾�|�9=n:���m�*�M�9�$�9����?���ޮa˥�*%^�y�R|�^�����A\?��~e��}799>��+�5b�R�Y��+����@�&.t��]/�G?�RAYb�I�w�,Kn�D\��W������ϻ��͏�#Y���Qv��e���,xDq�Yu0�+�!��ar��e�:�aƀ�����sZ�)>�� �5��rJzz$q�� K2̐>������y����c|,8;4����� y��?�B>��!�.��1^ٵN���GVr�L�f<=�pz8%��Y� ��΃����SB뜥�K���S�o��Zh��4�o�DJ�lo��[d����wH�,�D�9���͂Od���wH�,�D�9�"��M��H�ɧ�x�f�'r�>a��oˍ,�D���/�_>�yN����:D���#<�u�Z>}�#/���E�G�6
>���Fl��!�Q�	�_�k}[l��y��O�~<�Q�	�st����F�'4�QH �m���Oj���p.Jͳ�#c��>)ʾ-�a�s���\�����Lm���qJ�M��;-(q��.S�ʮ�nݣO>����E- q�d�TX?e�	��Zʈ[z|b�f����<8Y?��K�<��m@��@W�(w��ns��(G|�6�<�I���x�)od��O�����'V�9,�?j�A]�o����Ì���Ę�m���m;_�b�U-�F	8�3��&�Y���F�(OL��-���s��l_M�ַ��W�97\�4N�.��d��gMO��q�`"�ؒʮ��a��f�)&~_���X4���i�N��lS�=ԃ/�F��(G,N0���\>U�N����KƔ���Kf$�gL�%Ӑ��;a�W�Цo\�-�9oL<��L�Tf/�=�uyN�7�޷d�-�y��|�/o�/������',�9��@��mK��Tw��pc�?�����8�[���aڭ%%��9BgGB�]�J�)}������{@��������\�ψ��y�g:�OA#��X�������>�~xƜ���f�;���7�mΥ~*�Idqr[]?�Pz�vb�Q�x�8���/6�$�^�v���O�U]V{�kÄ�y�&�1ݜ����t��*[O�%;R�F�୥��,�T��!J֒d�<8+��B��v~�pΣ<1��z,/�(4[�e��je��tguRI;�ǯe�)E�����V�b{"���kmf��X¾^�z2;�6�^nP;�d�~C����f�J��y���X(�̶���J�eӾ�x�b�ʦ�kk�Q�x�HY� 3�aZ�!����7�K��?? q����?����*�\ʱs���j�1��c�8jӉ�ߴ�F���խOw��\�T�<h�4�R�+��"���L�p��!�;&����� ���c�v�J5�O��s?0x_~0��o�s�7t�n��:�3.��Ϭ($�n_�n��s��8�y'�g��X�I_^�/�ߐX�I_^�mE�-+��MF�O��t<-Ёq��|CZ�����8����v�U���5J^����-m����p��oI[tN�9��CTy"��L[��^[8��n�߱������g�х)>z�Qb;�e���G�o���;�[�]=>:|N�}��7^݌���~|t�´Lw��z��߰����7-��;�Z�]=>zx��;l]�]=>:|I����+� �
���5r^���K �2����w0/�Ƅ����`^|9M�q!�GCǅ����3��Xͣ�3`�^G.+�X/�����9��3*�_"1�'m���M�(SLhA$���4�Ã*E�s���T���Ǌ:��WJ\A/�$�s�<G��e\"�f�Ɠ�!���Q�xԃ����\�QV����0�7�S��a�cC?�2~�hF9b��b4%��$����N���|������`��
�/#5��SF��(OL*0��/���9:ɨ��T~K����$h��k�{� nӕ&�����9���~�z�ϯO���?<~||{���?�^��������������O�e���n�y�ee����QHqo�A��CĝS��k{E��+�e�����_�����S�IO����ח��!�>��\�2��[�pO�Yn�E�7-pb~�N���7+� "Z����{��\�Wȡ������I��(Q���˕��@霓��2�%ML"�P����M]ft�T�c�_�B�W�=�i��;܆B�^���;��/C![�e���l����;�,�;��u��˖�=|^~?�yu
W� ��V}�= ��Ճ�/k ��jZ%^����Z����|9@w���������ŏ7� +�TL8��6���{�d���o�>���r&�O=����	����H��J6'��7%�t������D;�V�ϝ���2�"�����p��c���ߞ��_)�e�/��w��S���v��?�z�2,ƿi�T�rJ��{�קwhX��Ƿ���)��k����;�k    �^��1�\1;|��'�з��+_r`bo��o�Y:��F���_^_���K}B�m�~}�|���������ށ]V������{5��T6�u���sߟ���r��g����|}zæ�F�K�K���.	4�z�pἸ"�jJ\p�F��*T���ԙs�l���û>%�z��(���z����������!�fYں����of!��|�7���X,X(�]k���1���s���Q��i�Q��JdZ��x����7Ӗح
g�9�@J�z0@�b�·�m�#�0R�jƗ�n���9�T·燭sW���x��-Ќr�ԭwW%���6ĻZ����˧���~��H��Z.��oO��Y�+$�����3�7&-�kk�a�`����ü�^��Dz�kw�l&Ӭ9b�4�?Y�Zi?.��y����1�m�#�
3�֊�e�������>�|)�ˇ�����O/_� �������4o_?���r@�	���)N]mp�3�;7��$?mW��;�j�R��pߵ$�h�#�~��ʅ���������~~꧿���l�S��b�Čf�8�������u3��C�x��H�d'I8�^���^'�ԒgG�r���4�q�w���m�?�+�Cy�h�#l3SPl-\관@z���7ZuFs�I-�h�)�_�}��K�ϔƟ�55B@�W�G,���v��T�W0�s��Q9�W�F9bZC(�5�#�џ���B�	|u=��>��6L�(GL=�ł���}�y�����!|�ZPPQ�A��ϧ����q!}wl��^�}s����ί�b�/��pvW�.kɈ�K���ټ�fR�fL��K���kؾ�w��m��h@�#|j��fV��������V\T��?l�ױ8j5�i�boZd�񰃌�[���3���ӹ1U7��/�	_�Q�@�\�ҥ�o}+p���َJ�z��|�<�a[�t3�t@47ւ^ ��~���rli�G�^�u��t#����E����W._�8y(���*>���J��}�6Z8�U�����h�剩�A�u($�8gi4���=)=Axb�ݙ�v8�b]�v�t�l-`�vaJ�hA�k�5:w�![)�B9�MtX�m�#����F�8E�]o�HZ<���h��#+�	�[R���\��)�'��mF9bC*щ����Sd_|R��2'��N-G,֢�\�5X�D���m.���ڡ�ԌrĴ}���rlS�-I�h��ؗo��X��S8�}���^���\���q	O�6��[[[;��)��ڭ߁];g�Ѿw�.	t3�bx��n�Oa�w�\7u�u�Γo��Pv]��m�#��
�`,`�L�p������K����ϥ}|��;\h9�$T�Ξ�����^����}IC;1�pby����?c�r{q6�1�Ƶ�r��g��#�l+������; �Um`�r�Ԇ�U�LY��W���Ԝ�����ɘ>B���Hݝ�q����4vr;p���<giC�J���O��/g��bV�c�7?����l7g����֏�֏�[X���z煽�vN�xn늱�	R4da���4��!�o	�[Rf�Kt�����8�]r�{ڎ/w3p�We;����Cq9.�H-:ڙ7�3�hg�}�J��f���c[���;"��+vqz瀿]�QRC`��L~7/�>�a3sٹ�R�M�=svw��e�\v��좝>x�\�2�]���K�!̓%�txp/��,p��觖�vວ;�t��ԙ�=�ƞ��;t�;?�td</�Sg�Ԝ�\�jr�����Z8g�t��w�AP�R��;���29?I�P']̓<������?��:�Mp���0o(m]С�Z�����S��-a�Қ @�i}W�8���3�]��w���\� ��?u�v}��e�zK����O]ىj�Բ{��$���p�fK�F��v����AF�˲3�e7��.�C�<�e���lޥB
��$:s�WtCwm������h́�g��j�s�.j@X��/��_�������ߞ���=�e�����A�� �ഒ{���*]R��� �-��خ"����&'�[);���ڕj�* �ʆ�w利�A\��d׭�.3ɕ�U�S��m� U�8��Pv�5r*�vS�W��Cb�y�#g�w�E�Y�'}ۆ�穩�>�/S���Fs���'��j�+���gGV=������k��6.j��،r�TaW����6�����m	�s]&�6���CQ	Z���D>Ϯ!�k�:h&C%�u��r�T q/K�PK���w� %H���u
�D���@�Egi���$���Kw2h��˽��I\G9b:���LzGia<g[��V��:؅��ٛ�v�����o=�b(�,Lh�#�xY2���l���=mo&�����궰co���RX��NK����#���8]��yW[�/�"��m�)&��Uf��&�6,]��V�N�&2!Sьr�ⲑ�X�7��m*�]K?��X �7�����
]�D��&EP�����)��q^R3�S��x����W�d=�E��2�}�:����xͯ�><��2�B!߱�r�(���cDM#���gN����9�� �|���q��6�Ӈ�xk�:�����AgB	墦\��!��+�D,V�s7,�gB����BU�	gB�R��Q����(1�L���[��۵q�K#���DS�b5����5v�Lk��u��>~b�@ҥ���a�t*� ^6.y��\�y����V�=u)��p^�6���9c;��r���#9Ŏk�����#�A�[����d�Ɋ�A\uH�}�V���\��O�_p������Ĩz@�c���q�[��	b̎�&2������ꏰO�7��D�<0�D������O�ﯰ0~y��q�5\��bM.�X\��7���F�/t��$BhS������	�b���L�kt�Ł��	��g�<��Ĥ����9�/��e�eĹ���~���v���Mc~	�ua@i@������\��¹�j�m�kd� �3�?t������b�}s˸�n)�p
LP���śy��E�ț[f�_�{kl�{x9���c�W;l�<�� �Zd:�v�6�\P���S�����<���� �C�?r��_ڶ��Fu����js%&�%�pŖǽ]`���lUz�X�*�/Ϗ�����y��"Y8��婝�;|F�ɸ5�>����U�9��ǕA�M�#q�@�4f{;l�̱��v�ׁ07$�� ^��7:�� �瀳-u���9�WG���Ř�AL�=��<��v������뿼�j���� ^Б�IϽ�E=��o��:����3E�UX��:t�5�:��y���;I�7�_ 8y6���͊I��Af��T��=z|�~��8��WL+��:�����E�.o�*��Z����<��t��T+[F����7�)���{<�@^����(G,�W����e!���5Z 7�s��[��Z������ۇ�@�v)]t�m�բK2��^_
Z���S�y�'�Ā?6��K�v9;�op�������ZDx�)���u&�e�_FG|H��:�Hj7�����~F�T�oB��xRd�Z���l�(������f}��pٿ
�Z%���ɠ��yj�{.A(�E�O����C��.u&K� �9�w+B�6w���N�ҥJ?���j;͵�ok��⼱�^M���5k���/�M۳����8ջe������t�@�>�T(>4U �L1��zծ��bUR���*��6U���9+"����Ĥ*����ݖF��et&�l��q9� ���  ��!8/ % ~��Y:F�O��%1*qZ�Gq.������$+��,�K��Q�X���ۏ(�t8{. �-t�1̶ߌ�Ĕ.!�Y:8�MW,z�LX�e^������B��8]��. ~ׇ A���
r�C���(SL�2�.c��_Dd̿O�y���t�������6�Z���� SLmcb�kj�G- ��!��    U�t���p�q����k�J(f�6�L1��GU̒�O��ۘy,�v���D<�	��l���qV����TӰ�k���� �Γ�F�bb��Ǝ^9k���+n�}�ʹ�!Z�L��@��$��m�'&g�8C,u�$��e�|�o�~����_vnn������r�����@���6zx|sj��»YnJ�oN��q����\��'�q��H���� ����6����?�>=��!Sv��/5�E��^�7�8� B�Im����1ś�!����(���*[��d9=�G�\ GR���Hz�{�DC�gRF��f�'�t!�ㆃf��眝﹛%�t3m��@��L/�u����w&��ybR�1�i<Ԃ%���t���n�i�������K���	��O��':x��5�6TӤJ��\( ��W�a/ir"��ɥ����V�s�f}�DvjV�/ś%T�z@e���ż��b�4�2�$#���q������ߌ2��T�(����xZ_����������o��+�
37�1���Q�Eq��
���ec)�KB�ip|���s[ʏ;�;e��I�(G,��3aT�3]=t(��sP
��5�<1y"��/�/�\Q��,�8�-�1$�o,��d��PE�Y���ֺ�OAd�w4�� �1��u��1:6�f�#����!�s�Ug^
�GL��A]3���"{g^6��%!�/Sk�5Ĳ\�.�(SL�B������`�D�1cZ��}��DͿ�;�cl+G�'ؖ]q�6�����]i�<pyR��/i�eq�k-]�fzC	>�H��l1�X� &��3��+G�"�Q�qC` J���f�ra|���0�8�!�U��C�Ѹ�����S�
&f΂�̒�����;�R��З��}D���f�!�_QZ�9��Uڜ�p�(i{�0���+��W4����jeu 4���//�_������z�}G	�kj�sgO�+o���6KoWLha-�?��[n�����0�?�k�޿e;�S�m֭�w���mT��s��t����8Qq��Y��{R�"��b��|>)����Q�������F����7�^ڿ��ײ��Wbg���9�-�{xA���C��	>n�?�y��&���6�������ɓ�'��P�����/�?<}y��4&�B�-dWi5MC�6�@�s;-��<� �־[2�q�,P� Ç��gٖ���70�llm����7(k�`[z���~����V<_������������7,7�S�cK�b��S��J��.E��`�6�u�LL�����]�=�[��E't�ܙ��ҟT��ϙ:M�ALO���ckn��:�P�	������Nyޛl�v��B�w�x|f[ĉ�C�|{+�����3lY���Ơĳu���[���\���a���n'W6d;f�;���L������׌����zM������){���}B����N��[5M��	>m�~���%�����t3���Mpy�]t���=<�Y�j�N�V=l�؏ P�S��7�6u�
%�4�<1�"��T#��X*a(�JC�	�4��g��0ԨQ��jOf� r���r�m��2�5��ѫbIݨt|I�i3�j%dYp�֧`��z�l�<1�#�H C�Yp��M!�0}�����(����v:P�ܘ�ݿ|zz�r�������3����}Ĭ�Yz\���_�� �W$Z�����������租���ˇ_����T�\�!�)�ڶz����z$Z��/�uM���u��B��h�z�ϧ��ߞ������ӧ������>==����ïe������ü8� �ڢ]qF�Y)� �7Pbү�R���tH����U�.9�ֹ)���ֿ��*?F'�D�G=89��@�M�jl��)�:����mߚ*�L�S'��o���(GL�փxq �י�W���y�9{�:b�����g�μ}��>Y�	y{�'�E�Vy���:1�Zy�ٗ��u�~���X�N�L?.%�1���Q���c|U������Q��vrp�F׫��~6���F�@��&�h���$�ILe@���&y���Y=p)�Y�#��0؆:d�t��#�X���>�I��∹	%_�Iq�6�M/���@�}܍A�����x����`�
�_}�l���~�a %�a��Ɔ�Y16.�߈-js�=MF�S�7���k�Ŗ��v���|�k��7�/7.W�����z��L�q�����}��� �%B���|�k�n�y����Կə��\���I�@"��l�����W�	0Ox)l����?MHH�UU�%�#��˧������ߟ��^��ݽ�[��~�U�p��f���rq���B�glA�����7�{Pb �	pI .�����@@�hJnXq�L��%��ySp��K�a�"1s^���aL����2�n�d�|;�8%�Ϫ	pF�}�`�N,J���9+'�éE�a�Nb���o��y�)�$"�i&�ܘ@�W��'9jc!8�|_�2e�ܔ�~
n��Rb�9�d��Kn�Fg���Q�Dt|�i��}|�S$��(:�Z�Q&8���5�0%QtBd�g�O��U%^I��Y����B����$JN���k�>!Ƈ�Hx%QrBd����1/"��������a��h]~| 7��7j�$�W�'�ΦnL{��?���#8���l�.(1|W��I��섋.�Y�f��J������N�QG� ���̜���^��2�!F1�s�S�$�WB>n8Z3�Y����Qx�fvs31��$��%��2��C�a�K�D���c��%��#��$:����Dv"%��#,IL	u�b���))g�)���(ۭ5-�>[�|65ؒr�޵%:�w�e@4��pZ[���5&=:a�~�د����	�K����aGqE7l��nל��̜��I����	�L���]|BphhjW����r�v�z��u��bw]��x�Ƅ	J\���>g�N��z��u���t���ݤX�h�I�
�Y��a�A��:w�m�'9+��5]̦��V��]�$g��b{����A\�n�Pt���Y��	0�"P=�jM�
'9+ܼ�n��>+��sw���p��:���
M�ԗ�2��%�b�`�z��Y��/���*������%]�_���^8Z�0�rTDE*�(SL(1K���|%��t��֐�\��hz�Q��Rb|��(�ϣ��C���<ts3�'�u�F�bJ�!XC� 'w���t�2���S��d�-�m�&bn�QB	���w���ܖ�������O���`,���4���^��ж��Ƚ���t���ikz8����'�׼n��ɇ������)o�l�)Ʀ���d�W̬�Tb���������ߟ>��������ޟ_���������O�??�||�����緷�/d)�)���Shʾ�'u]XF�3�� �2eY����g�͈!�����R�68�=F�,g$}�1�=��=8�=Ƌo
d�� ��۽�c���%�l񏕃�@'���ߓ���A\�7T/�ǴMJ�踤�w@/��D��K�⊎�ey�=&�o
l2m�{��c�ܢ��3�cq�������
�o�|�u�Dט,=�O����1a?�t@'4(��S�#:�Q�Р��6%�舣b?�u@'=�h�ǥ��xT��__e�?�ag�M�I�'Jy��y��q���]�&�����O�̎ݞ��f�,�obn�"��d	� �#�_�ݤ��6����2z��GU��P���A�@�3�'{��)�1�"���^5FT���,>�8~�Ȭ9�6�M�k��8���nP)�?���<�ˮ�;�$����~�F�M90�踅fg"���}�[s��隣����F7��9�q�&�;Cݚ�H�f$
L�w�6�!�v� �{�����FF�^�92����k��:dtoɱ.i����s�Ï·�����������i�hOqe'�}����@ux��
%X�Q����QMY��I׌����R���z�zW\�6�    �Ĥ��\�9	����eK�/����ǖ�r�\M��p��(�����?̧����[�n�x�,k������A2kg�`P�e��9��Kp�����>ļ9f�K;�D�Ż��������>���^�Ŏ���;p����[`�W�M�J�=c�Z�m�n?�v(�u�f���e���χ椟4�?%.?r��ka����@p��ycN*f���6�<1y�mӖd��O���2�v����n���a���(�"�2��b�i,E��%k(�H�*��i�*��� /�%]v��re���JRoerM�y��?�}@��P�y�B��,Z�6�q�7o�A%�ҢQ��5�š�V���m�҅��|J��]�m�#�2��K��@Lt�>�K�W�;T;J��RbJ	�*�U6H�lI��O��7��FybR���%�9���t*ݪ����E��(w�e�	UƫQ���J�[v�,3h���O�񲅇Ό�!ȸ�k��ދʧ���9�F9b�D�[���R�Mk��.�&�nF�bJ	^8�d�^��Q�^�,��&^��(OLjB,*K.*~��ǫmږ'�r/k3z�=�Q��ԂEŔ�z��ח_??}y���������S�4�ϟ��~y���~~z|���De�\��&��=�5����\� ��_m��u����)�h�{$ZcPt�b�K���-,u0) ���i�,�O�Q���aSl��*�6$J*�d���f�'&��EYʋ�|/ʎ9���W�b�bvH�f�'��/a̿=��I%�>e�}���Fb�K� �+��ٖ���m��Q%C��4Q���ڌ�r�KW�(%��	����jb��;ܚ^'Ӄ��z�h���+iF�bJ	��"�ߤ�E��̃v'��
�YjF�bJ	&�d��-�X{@St`T�d���Q��T��%��#�F u�(��˨�I��)�kӫ���o��M�aD�}�F��A�A<�q����Q�y�L[o��i��y姿.�f!i�S�([�h<=������r��Cm�"�)��A��t��s�'m��\�.ߵ�ǃ��87Mb���a�{��N.��!J�36+x�qs~�)�C���9���3l��aWlA�#��C԰+�$�6���b;D���7%Yo�ǫC���UP{غDh�fC0�gY��9m��1����N��	w�q>���V�������;F8���۫=��F�3p���dCx���LX�I6Ĝv
�'�
N�!�f�x��
N�!��2Sl�
l>��J6=�����c|S�f�s��B<s	�Vp{+�!��c�I+�������AJ����a8 dw��?+8��0�qR�
�+�;s�Нb�_XIp�v9&k�[�۵�N�|
n�4H������)d1���EM3!�\#)�B<�[6�L1������ce���n��L�-�c���"���[jZ�4Cw0st��	��4s�h'�����_�ؒ<�r�c��M2o�b��cVl���W��~+6A��rl�����]�p��� �XKj���*X�	�=ފMȱV+6A��;q �X��51^��^�5*X�	���˼��}
Vl�c��銧��)X�	���{�X#���X���N���bAzdm�baNf;�v���M`{���(��Z�"�oA�@q��~�&�!����Y�����{F9��d'�k��[�=���5�(���{bL#�(lWp��X��;����D��^ӈ�1���$:6�؟�;�$���<�$y,���
N���y�����mg�El
���
N`J��!9�"��<<Y%߭�H�Vp;'�=�!�b<�Y��A
���[��9� ����Y���9J ��V��c��ǭ/���N�4����J�v< �� 0f	���B�l�]z�6�c�o��[�Q竝����/���|}}{����#�mT���,�fA�?�⬙��s�j�sKW�kэ{�����"�(OLN5���RF#-�j�S����k୯�å�x9!�2+�h�u]�� �6C��vF{�Z���ģ&�]�lRan��T�$<�3*�)�h�)�T!r�=Q'�l��i�hT1-E\�{�Kg/5�B�h�s!���@h���A��0���BCb��uv�~� r��
��@@��������/�߿?=��2'��P�d����b�|xp.M���(O<�m�	_����è�Ap|ﺌ�����1��շ�����oI~�������͸O͐�;��xI�ؽCu���Йo q<�e��Y�������C���ɵ��\��\!�d4���g�b�%��L�Ϧ�k�O�β��^/=L2�S���m�<1�q/�����Dk�ϡ���mV�ş��#J�p�i35u���eY���:b�m�)�� ��%���%zt��Z��W���P5(�)=�7���� ���ܫ�����A��׋�z4�ܔ%}�_�>�?��b��������xF�E��ï�KS�箋^(-��L8^��O^O^Yq�&�/*�?*#z��E��=o\4��32x��;����s"xB~��Iۋ]1y�:��R���ʱ����Y�ѓۼC�v�Q	�{�����
/�L�|�{�^���$�_��EUt:�|�@k�V�d�0,��w0�y����rbt��������e���k�m	���c��+�Gr1��wef��c����:j�)V�͹8�Խ�J.�M����W,q�P�O�$���5�d�9���G�f�)&.��.�Nr������YoK6ݲP�Q�xx£ċD  ��x������\�i-�e�e��{�%N�_m�I1#�3����{4�L1  .�z�pº�u5��Ui�cHC�KT�S�e�3��%����\����=b,]05���#( Z�v������D7�i ���r�	qe�e�L�Dq*5�n�,z_Y�X�ݰA��b�ߣr�y�R;�h,�kF�b�{l�ؖ��K���Bʧ`�Ѐ�b�،����j�vX%�P�0i3��z����3��&�p�T�H$^����jt�h��h3;k���Û��3c�}�e�%���0��^Q�%���BB�Lx��4�i�`3��`�9.ˀr��n��.T��Ԃ���m�<1�qhY�n%go�{���N*E����r�b=�CK��鎚����ZӯzG7�ċ'��Ĉ��>�\��q
q��Q���g��9ʈG�yԣ�+JA�c�E�e�ez���$w��ѡjԽQ���ȱ��=�:�SzP]cu7��3�H�QU��$^����j��D�B�,�K�5�B�8xԌ�Ĥ�6wT�@�8�8g�^������,�m�)�� |NG]i�hY٩�l�d�iz��T��So�N����y�x�S�"Wv(��+��3޾IbN��z,,��(&g�C��(OL�A�SO�S���"���vEA�4�(O,��,�C�u�}���t�X��V�,�m�'�ċ��3������ë�����e�RW+���i@�v��])r��i�!y�grd�ċՠ��$��yҏ��U�Z����(��(��EΕ�I���n�K�o�D�.�P��=�]{�G}�,�"��7�0}���[�S}{x�C'z�|tM��S&|Wt��v[I�C�����=m��s����_��E�A6���iؗ=ޜD�i�5^ߒ�]g�d��ݟ�����N�7'�7KSO�2!)����l�#�(�5�?-�����Y�n��f�h��ٿ�s�o6�k����E���c^��߽l�<1��7��¦A6E��[_s�ġe�E�L1�Ǽz�G��[��zy6,O,~CFȚQ��҃:�z�V���l�.�$�3w�(��v��;}���m�y���Ґ�[:a*�a&��(P�p�c�
n?�'�y<��`�e��}��X��'R��pd괰��ϣ��e��;�wdE'+Zv[8�	bE'+Z�3e닲f�l��rkw��uE'��ڈ3������Di�ZXp��uE'2�Z����Nd�����1"���kaG��T�+:�5�A|�#C=��2�Ҿ�3���\щ,�Q�/{�    �sE'�(FJQy��sE'�=��c�(��Nd�zG�=Wt"{g�tZ ��ƃ�Y��"{'�t�~tE'�w�	}���Fߘ8ɴ��4^�+ѣ��Dާ�v�dY�(��#N2#:+�#(�!���쬐/;� �0u��i}�7�CI�� ;�(m��o�zxBR���Vx��E�=ިg�'�[��;��mE'+t2��x#�3�$�$��g^��*ɣ��ձns+<Y%y�7`<Fo���4�����d��Yl��/��dV� Uﱆ}+<�U����q����*ky��A����,K��I�Wx�bw-�=��>û�(��3��;F����H�q����Ԑ�,$�^щmœw�.z�':4�d��(_�Ntfh'�w�1z�';3�,dv�3ze��JR����t9����+�+f��ז|0�c�\�]ٸ}"�ޱ��ޕ����P�yaH��uCJ�L��n�3I�����W���6��,�)<�oo�8��@N��گۗ֫l�`K�9���#�����g]�{k��)�g2�?jFybJ*�y����(�,�6���!	m��(���6��z⪇����d9�������N��N�e�)=jC�� ɂKפ�:��A�S,��ybR�y�IpP'!YVɢ�3��IN��K��>���Q���cd+zP�*J�yrhY�Jd����ŀ�ꂚA��T�`޵�.Y��g�4h�Q7@���e�S��d��6���=������2����h��y&v��vo�ވv���ۜL�x�lcL1�żx��I���Bo)�*���e�:t� QwB�Q�x�p�5=,�T���x���Kq��?�?������m����)��\Vs�}�����b�F�'[!z[f�?�??~x�I��Re�����5@-[��r;��=�O��_2�U.��k�Ɂ�Q��t��i�顃��� dq�O��Rl�I5�}	r��hF�F0����d�)o�@4�?G�G����K�� ����F�bJ�yUE��/���??~yah��e'@�sN���Gy�ӂ�)	��ܒ	�c���s��e �S�	���"Tl��S�3�e�K�	.P3w���.6:wRjz�M��Tt��7�
�-2O��D�hx�u/���l����M��QK;�U�N_�][z�^+�������߶۴q��d�J�O�S�HN��r����P�ꂮ9��(O,��4�J����O�^��d��-�+@b��^a �X��\�=�zp{��p��VpZNvf�_��)=8�i|��b�fE��F�X=�
�I��edM�*�X�y	�$���)VpAN�Y��Y���,������$D�k�=w�e'9 �^��X�\�i/Qg�P�
Nr@���l
�����H{y&p�JPVp�"9�Sr�e'9!R�1�	�P��g��|���>�A�ePy��b�g���ሒ�D�<f�SK��ڌ�d��Go�L1��2lǀ�*_��|�a�f��1� ���[�� �@o�H��^�=3Yt%�.�nF�b"����Q���������t+!�&ZM��o�[	F�k���S����ڪE4�S�P$�K�L�D��H�bL�5Y�֠�(C,_�]�_�������;4a:���Y	>�F�D�|*�5�D�<1y�̳C:=Da���*��ͻ衊��=}o�L1��NvH����9��Lؿ�QC�x���c���!r���L
���	�>7�<1��<��KfMW�zŖ�Sh	f+)<3��NQ����6��U�K�aa��nuw�d����%D�t��_�SL�1O!A+J'Q�n�0���ِAb1��e�����Z�8"��8��%&-��+�~���`�ӌr����Z�;��!�TSW�v�_��8w�1�=���ԙ�^ �(SLM3q9�QU	�k���|��&�#ׅ��)�x��<�$ɾ����8�u����˾G��$/�>�&׳V��7޻��~�I=s�tZ�%�7�Yھ�P���$Ȫ�-k'�G=���u������BʧbMQ�S4����*���H>qtq���ﱍ2Ŕ�>��>��*YZ}
�i��)����]Q�vn��y����>���AJ��Sr�Hܡl����b
������A����xɅ,ଽ���h^���n�9�tPtW|�:g�蜙7Ɋ�ٱI��/܃x�G�Ar��y��_T��o� |K�3�|�S�Q�o�1]ME5KS��V���g��ƈ��}(7o�8��s5m�>�x�=z�hL��$/e<�8���Ir�4��(��
N����	���
N���m3w�nl'�	��͜�;D7vN����O���-?>��`���@�����S̉��Q\�o��~�o����0&���6,<E���u��a�ls{�@�1��z�-�K�	�_I
�y��b2̈́��u���]�X�y+=:/3=��4C�"h��%����{t�*��d�+��̕��M���"?��d7ue@'��cL�+:���^':\щ���1����p݅�<�+:Q]��ͧ�G>-5d�t"k�G�7Aw���΋����YL��`\�IΊ,L]=N�����Y�<���+:�Y!t���/��$GE�c���;F����y���1�����Fl��/��$GE�%�^\�I��,�G:N�������Ǚ�����r��ċ+:�Q���A�����iWp��b�]�z�vqE':*�0�a��.��DG�^W�	�c��ke��Q�U���)����P1��1.讕~#tq���;����V����ŕ�	!ת�}cܡ��;F���7�=���	�CO[�/�}�"p��Q�:�1��Q���O�����z�=>�Q�����GW���@��mk��(SL)B�9.N#�X�{�_���?~���>�~x~{ڵ��Jߝ@D����_���Ń�w,���s2|����c�gx�ו��f���w���2|{/|��Ty�碗�s�ysN��Ǚ�eƟ\Ȧ�x�F��a��e��/ʔ�LR6O��68���� ����`�%����)"��zH]�ɨ��g�Q����T���f:�f�X|�U@��:�0�m�L1u4�F��"��ZO�e��!b�Ї��Զ�4uG�!l�`p��� }�R��z<\�����v`��2�Xc�)�AT�j��h�m[��*K�y��cV��m�'&� 
�,�9��+�౫�_��\.�"�H3���-΋"�RDv*�A�;�&��O��IE�S��2$u�?�>��~������ן����N�إ��E��*�l�X�m�'&U!6I��hS}<�{]��L�t�W��+�鍑#�(񲋉ES�#Z4	��k�Q��k�&�3l�<1�U��s	�qmޞ��\!�Iie�F0���IE����o��xp�j���������ΣL1���y@Ȗ.}Fk��'�kd����椖��`�mT� ����L���v�Q��3Ma�:��mQ���K.L���v��!�Ta�G=��b�P�34r�|;�eW.x�Va���@����HA��ԚG���=}���8N %5+;� .�a�<�3�_��e	��i�w���qE�p�����Z�Q\{�����0G�Q�a3���x�g���R0���������y�� Dc���IY���~�C�� ���]�w��.�`; 0�.��W�G�XZ��x�W��U4�㭌���s�Fx��.�����_v���NṐm��u?{񁹮��?�눺���%���.����)�y�
��៼���_�����uG�xJa�4�\ٍ�F�Q������םp��S_Z��j,��g����������������/;z�+}T�lzP����#\�ʹ-�������,���GQ�����>:�;"�.�е�(&:*]gS輊��/_ߞ?����X�z��_nZ��w�rL(m�������������>%}z��g������O.�+�y�N�;/�7�w��Y���JR��X����e��߱D������>~�����7��T����n9�S}"    ����e?=��.�5�(��t��gWߕKꟿ|����2�=��r�������ߟ^w���R�,����fP��@du������ۗ3�]�:N?�-�@��y��k�h��F9�������P���Ի�Ϙk��+�n'_��w�+̚�!K*W�mSIǊ1;�̵����N����[�~�+���+�iY~���D�#�]����e�NM>�!��3��!����A���u��H�}�e£[H�,�)�X��~/u
�Db|����5��)���a�n#1&����0�ڹ���k�0�G7�I�Le�'T�)�ڣ[I�	%i<6�k%��t���`���Fߗ���<q�%���>�D����Y���Z���xq{ݩ&�5N���ɘ�#^������v|��(SL-�y�C�d^��c̠��X�u���ft��@�W�u��v)���oʵF+��o"S,��u�-a\��q5@�o�&mW�����V3�S*P��K�`�KUh�6��
x���ģ�-�����K��$9�f04�Y ��p�|}r��4�Q��\�s&�N�T�O3Nn�� A�'Q�'�8�z��u�xMn�L1���[���qh[V����.�%�dp>�6�S��[�� �݊�d_�:?�#i��K���s�	n�@�я�T[������%b���c5�`M���b�:�s�EmFl���t��u��Q��Td�6���s�}`nј��]�Q�Q�X�Bge-_��K��.�0�r���y��I֡��K���S��� SL��Ng�n�p���+�E��F�f�e
��'���l�A�=���Gp3��̛�tK]d�m��^M�q�)�;뷂֙l���ޚ��S���r�f�'&��#KgOdu@�C�Z�`\�N%���Q���cZ��'���bF��Ko�L��f�#74��,���֜$���;M:��Xܢ�Kly���/ri7����;��Q��Rdޣ�SD�t�O.�&��9���'�(OL�1�Q��!����gj�4ē�Ʒ/�h�'�m��)"�"�������m�)���7E趺�Lϸ��D�YdR�33��k:����v
�f]:�2ˑ� oF���xXxp(ж���\N,�ۖn���ѿ��|��4�Lf�vi�ݏ����+yz~�&UL��)��A�#��7yKޥ�YX�w(�&��&q���:2����Z[��-���^(��_��9�tr�7@�o�QU��P���e
-+¬L�&����ޟ>>�?�?����Z�3����|}��naO�Lᾤ�k*��T��Nw�ne����mP=ʂ3E+L�7��ds.نm�o@煉�bp\62
\��W`P�҃x�N�Ѕ,G�MR�y�*3���*�c��r���]��)��I�/��L�cp͔v�3����L�cP�Li-̔N��ϔ>pMҐe3�=f�I���8>�E"�ɲ��"p�ٌ��.	oN���ę��%��#2U�,��y������V&�Ĝ,���i�4;J�Gd�:a2�<�v��Qb�="��	s ��ZL��9�czR$2U�00�x	�8��2eW��s{�#hx�%%��#��0u.�<-�;g��Q�����J�q3Ӣ�0{D
��^�r&�Q(1�aX����F��2�����e��^�	:�L�0y�]�C�K���mWx�C�K����Wx�C��v�N\����H?�w�y�
Ovh� �w�}�Z'�^{�&Uq���?BUA���TY�M�1��
m�54���x�l_�T�L!nG��A��TY�8r�)�Z�<4���A�l�u�l_��vl�+;��Z�\]4�*�P�v*h�W��xތL��f��B�B��n��v[.��ǧ>��r�ōA�J·�,+��n��byU�~�x?5�<1����A�g}�r�I��B�m�e�)�:8T0h�[O�M�!�F��
�(OL�0^��
�q��P�q��Tޝʗ�8ӧe�v�軜N�V��p�6�r�S8�e�)���W�*5gr�tz3��nv�۴=aZ�m�I/7\C���Ĥ
s��N��o�-�v�f�-�f�)&T�!��T�nӖ�e���Fw|��(OL�0���T��0OϿ�/��D+��~I���z�<S)���^L�0Ϥ�T`nS��Ou�fh��o�f�)�T ��#�)�L�c��T���k�s�_Y(�X��Nbe�)U��-J�o�׫g`Z���X��muʕ�$�]�Q��R�*!s�ŉ�=A�2�y>��P�a4�S�IĻ-���z��$�q�ʉڻ���֎4?�y-]18�w�c�I���n�����8�6�L̮mG�Fy�Q�]��N恤wȤoF��iYG�y5����q
jd�-��	з��͝�	B���͘���%�e5�|h]PO�� �Y�oĲ���l�K��'�n޸�.��U�Ap�X���Q����v⪂�TP�r�6q�u��)���gd�E�Z#&&s�o�_��&??��������OO��~����������ooc���//�j�:U}dIPdT
�%�Fǌ�X:1�E�&���!V��{>�]��謃je�(OLz	��:]�����(L}7r��i[o����QO�/����2��pi�N����^�:��V\*ʵI�5�+,��J��BX��<[��iB���� ���������B���M����S���q�7?���SVδ�_�@!;6e+�\n�Wwņ�\����v�1��9��������WSQ�l�EW��o�gk�n�!�U�/Ok��<BI�?.�ۥ�3b�?����1
�����4��Nl}�d�e.c�aDEe~z��0�G��k��ƨ3���b�3}+x��E���n�>��E����,�3�m3@�(G,~�Uʳ*%h�?�,��U�𩢋]��˨㉅NQ]�K�\�����0��:O��!��l���H�zF�� Y����P����g
,h��Eȶx(S��jFybrz�����-��W
�6��|�Y!�Aq�`*��~$tj)�=f?��k@���6$��%���]ᝯkN+�]�-�ŝO[�� M�bÊ�ӎ� �8ڒC������D�Q��R`�Q�)X
���Kj��%c�Q��R`'�+P9��V.)�2PS�|�rJ�pN�e�_Q�Е���
�)�[�Hɚ0�m�'��/;�H�Y�I�)G��G�*�U�<u�f�:��g�$�5��+�/r�Q��X�;���?�,Seu�r���c̘q��ŉ�x������B�5@�\D��Zc5.��#��B���S������|�ے04���e��@Qf�a�t��n�H|�y����������%@�yS<7�`?��^��5�Q����y�Xó�ؿ����X�sG_FSL���U�?	C��V�$�I .9�P�S3��j�3+�7,À�_2h-�ڎ�|e�)����+H��6H\su��pr^���<�Q��Rc'}��
,3cT$�Q���9ZC-�ܑ���e��zx���~�VOD,I���\IM
��l<��g��O��G*�dX>J"iӓ�W�Y�f�)���<���*Jl��˧<f����=eY���}˜�'�����m�'&gw�n�g7<��iX.%^?8w*טq��6����W��m�r��»����^�u�'&5�s5�9&B����O_?���S��:1�,e���'K��U���(C�N�i� Nq��W`�h����Xv������<��4���L��(	����������O�Y�&��������߯���S�A�󓦇'����jXb���a�h��j3Y�
��-���T��:�S�+��>0�h�U0��\9����m�#��uny^Aۂ�-!��ߴ�5�<1���� �[�w���/(�M�_`e�)�e��+	OK���$=�����id���	/�I����o��(SLM��/qǻ�dl'�2��O���Y�6��
�k'�����4#��L0����AcG��I������ҝ��'�N;G���_4m����4��B�y[��2Ń
��]������.�    �\��z�[Ѽ.�vUݩ�r=v��ܮ����L��(3�v+"~�1=�cZ3v�
��u�e\�.oW����i�tcޮgA�-Yg���G]L7c̓��|̛5Q�V6yAhO���e�~�H���(	:�'�6��%�e+@��O�\j2��!��p��5�ߝ�I�{Q�Fybrz�};q�1ZI�`ONT{�Ղ �r�Y�Q��Tc�/�{����VM� �$M�C�<��;t��G��ƭ�:�@�h��rc��1���Ww[ׂ��ݵ�s�)U(!"�z�+|�I5�mb��%�d�m�큡(k��֌�Ĕ;�?���b�wn �e���Q��Oλ�w����`�lm��	�s�
l�L1���Ws���j��q��靫+9�vHo�3�<;؆�/IH��9�Bme�IN�A��g�w����W��WN%G�r��FY]���^M-��Gߥ^I\����v����X���k�)�&��α�Jb�ܾ;�/��������>�.X?�w���J4��CY7������bC���L�%e���0���>�C�W��b���������D���	�r�����:���T��C۟*���I��TYF�b�-%�9m(w������@��r�$��(OL~"�a)�į�T^S�gU����nG'��b�]�˫38t�,o�E�g\fҌ2ń;�軅�rO�G���p�̐��~�6�������^��fqˋe	Z���E�F9b�g���e�'��ӗ�!�OV�d脢.l*&���uk�ím����	�o��'��B��-N��5!�[E8��J��S� �j{�s��{P�]����~�vn���l���� /(<O6�ۇǭ-%�]o����3xF�M��gd���.������=C�D�5�ã^,1,/!�1l$���l`d5�Q��2=s��.eG��=�t�j�:
�m�)����8� Kn	9u��@N6���f�!&���u;�,�HϋV���O�c�*J�� T(&	b���S n�˔�fv)���rh�@~b\'0˿|��+q�vRtmύp���m/A�6�Z�-�3�B9�f���#'�b5/������gNQ��h�)��ϳ��]g���4���Y8��(�쨾�@�#����m�)��v�KBG;�&�*��;��ךQ��ޅÇ#n	^	lD�R%� ��h����X��/���2�q�(��b����<؀���(OL�1O��(1�/���\����H(����>��K�*1�g\
ٌr�����P�c�>��i<�b4�;	<!x�lO4����H(ɳ�m�!�y�^π�%F�~�6�S
̓o��R��,ѹL�(���0^�0���������Ҝ�oٮNf��x� ��ɧ��Jw���@�M����xW�����4V�u��.��J{���-9 ��J��������+z|�� d��P�:��w�Co�/��o�P�:���Ңw�'�?��y����+=z{|Y�B��4%��7���	��2�>ֹ���3���}�:?^r��3���6Ϻ%[;=mo���9X��g�3c7˧��$�x޶�)s2Yy���r��t+|W+WQ2�^1[��P��?�ۍn���� ��U����`s�I疛 ��Ĥ&S��N����G���V�ߔO�\�=�W�,jS�P��Y��#o���`^���/�o��	7p/&U����k+	Uq�U�4&�m�m�)�T����@s
#iN�V�1�Sp_u��cs/�O'-���=�!��=���Xcۇ���H9��~`��/�y&�����M�LY���4���M#�W��)��n��n���>��Q��&L?��ͱ�����n��ې���mHM�I*��rm�N����q����UX�.3G�MY(����Dvp���l	J	N���������:@|Wܳ#��+�ʈ�@�'77�z�j���S^OĔs&��kq�V`<�1K߆*�B��f�'�����$~d0(���Э�I;�1#H3�Sw�9�w�I�𓸝¡[1hw�ޣ�CFZlWν��|�(SL]	�Ν*It�0Ӈ﬋��� Uv�R��Õ8۔�X2�d�e�e��������{큜+i|��Fb1�r�;�׼��7��t�L���[
����'/S3���0�Vh�σL1�LI��� �%�`�E��9MVo`�勺;:%F&���
m舑��T��(SL�S��>#=:ۢ�u�x �:Y���F�b�����gt̢%���'���B�L��t�Mf�(ccO'ʭ��F�bJ�)�g��pχ��ʅ�(m����FybR�)+w���"���~�t����6����71-���hޡfB�d�Q���cN���./�'�n0��>��b��f�)�T��Pv��mW��B�mO6[B���Ĥ*S��~��NƮm��3Jϳ�f�#�ѭ.�F)~+���ݼ����z�FybR�)$�$.K����D�\ �?%�T�=��(O,S�{��£$%�E.�2�U�Q��ReZ`�m#1�ۭ�sq�CN�#'�FybJ�9A4�$.�deI5����=o�:����3��W�o�Ϯ0���5��j̩��Ax �U���/�5Mc��a�b�*������X���=�JN��zt���~�5=CQp���r7
�A�{���JI[)�k|A/
���(OL�����_5�8��m�����vEF�(SL�1eL�M��� h)�a��e�e�൥-m2�s�����#�,4��j�	�;�*�<Г��[H�uį�(O,S��"Vr��]�M�W��-[�@Y��y�'��H��um�����Tғ���G��ģ*�xQ�8�\��}�fz>@t�*$�����(n�q�3�O#o[�����i�+FK�<7T9�}�@r��]�����)���Ƚ_*�Y��]3oG2���x�;T�7�������v��s3����%����oF<�͠�5t�*��A�gP��q�oF��͠ԕ��ȷ��Ϡ�G�S#s+��n���ׄ��v ���Ⱁ��7�~
�c7��8q����O^^?�������Ϗo}�Vw28Ge�7�db�H�f�'��_�� R��볦���*��� S,Ԥ�,��$y�H�Ė���}L��o�<1�ɔ��Z��$��{=*/�I����Q�X�~>+ǐl�t�de�/&I���v�S1�ʔN��&VZ30�Gxy������l�<�P�n�Di�H]� #M,�K�D��2Ŕ*Sf�~�d��«�&�_béX���r%
LF�X�.�$K3e�{��e�����Q��Reް�O�Ѣ�eO�Oх�&"O,ԣK^������)�Z�࠲=�G�f�'��N��'١�?�E�6K�N=�Oƪ����:�Ki���8�'q{�7�zЧGZ��=�C�>���q��Zt'�O�#��ːAS�8�ʹ=4�XF#SLؐy���#t�Ū\
���&�(��(G,�n�U:��O7����=�����f�����{�L/跃��^��SWP-{�;8�C�6;��2Ų��e�K���W�(0��j|�Fyb�-�6��OZ�b�d>�3A\�b�3�WLx8&7�\����ԇA�Q�X<�|���d�@�c�	��Q�X�j�<bi$�ܖK�ʅܻ�=�m�)�<�)qj�JLz�y��:x��F�.�{e�ez�����*��j�U<E�0�`3��U��	ݳ�(U�S�����F�bJ�i3�~u��^wz������;�(O,ԣ�R]��|hu����YY��Q�������g�	�ws�n�V�I�]�s��A���d�(�gvKN�P��ҨĖu�O�Y��A�Q�X�G�E�L�z�S=B*�D�<1�ɴ�L�ED1��{=t}�P'��i��Q�X�Gw�H]�8��ܪ�	>!�ډ���P��q�T3�K��੆�u{�9XOg�-��.�K����H���L1��<1ia(�몱�U���A霉U#���Uc$�"Sj�
�˪}���Q�X�J�7�B�(EG��$a$�H̎#7U�/�7�0ϫ�U�ά��U��� b�9�    �����m��F��^7?��+�/�l�
��cW+ɒ���e+�7͙CN���qO�(�Oo��PUxH�9��དྷ �U@&��g��	1'4QvNLc�Sq����\
�H:y�!-���y���r�]�>^^��.�?������˻lLz'7�^C�"o�	]A�9R�}��1v��O�i���U��s�	B�lHC"Ҡͽ�R6��&S��$'ر������~��iF��a�	u2ٮm�C�x�n�c��8�v6׆B�ɇ^+͟nCq�fX�����6sl{o_su(d�\9h��q��(�;h��[i��Co_38�Lz5���X� �q�$�}��HZr9"�?�XBm�iϣ�n2��ko_36�\��Z�l(��C��Sn<������6�D��ѹE�F��;��B����kU܍/[��nI�:�{%��!�cH%m�_��syл_�l��޽!�a���{�^����^0R����n�ܳ��yFz	�1{���X��x?�,1b��?|�S�� q��i�U#�8&?'����l�l㏹�C�G+��~�ޞf8!��P��|���?˒ˎ�\�Bf%ܐ3�ޞfx(�u�$,�J�����]��/�Uz����S�g�dDC0\9��U83c�޾fp(�+�{���5��������0��`��=�� ������rߥ��|�EyG�*��޾����BR��e�T}�u������#Y��Z�8� �=w��WM6��}͵q4.��{��򮫯��*t(�u<�zO�9#9�n��_�><�>=LS�����(�x���=חE"����,|�b�ywҜ����C%ⴂ��I������2�Mo{�}���x:�u�<\��M�9l4~G=�m���f�-�fp��RО*�I8�ER���*d�J_����\��3]�]��L�n��S�< Ɣ�*?�t2���5�����I*�Ijmy~	�U��QEg�����v~��gs�d
�e�>����	��ޞf8d9��S��3�����'�e���J��fЦ�σ�Ф����i�?ӭ��.w��h�sqg��}ҍ(�{%p�5���O�_jt�γ����^h�:2�=�]Yj�33+����MA�RǅX]=*�v�޾��	�N��=etߢ���p^�]����޾fp(�Z��i(������8�}��8��"�@T�&6|ޛ�*qSZE4��i�w��+Q�=D�S]e�C���42A�z���d���T��Ls[oI���x�d�e��k��N �Z!��~I��6�:O��{o_sm�ĥ�0��Ke�sw���u��>��$��͵q����q��cE�MU�[�s܋�Xx��i�3�g݇��jR�\��ҟ���w�>J��F�Ұ9 �{�a�����g>�gH������g~�"TS��:-��fC��i�'I:���Y:����TNnx���[�~o����p|�௯��6�����5W5��?�+v�l�û�#NoRt�#��8y,\�7C]�%/�7�i�S�g�ɬ�0��J�y>�t�r��hƇ��K�R��*�`|�Iù#Nץ��dٸ'W�?软��6�F��tU��]���1J.�
�-��[V�����M�'�>�٨��h�pt�IoO3<�tb9�i(5@$�+ɗ�Sz.�P#%���h��4�=�^73Һл�eO��P����[����Z�6�����/!�g�wl�?jɊg��ld;6Ȧjr�s?�l����-���n������Û���kE�.&��h_n�Gx7��#��Z��wtV���˩���e��hA�D�={���S��=}�
�o7�W�K����;��h�;���Y��2=��x�ˈ�
|�jE��!��PCe\�wJ��=@�6�C�	052#r� F�Nt�q@.�mZ�`Z�e���pʄ&{oO3,�Ⱦ*����jNZn�ө�z��k�^T��2��	�Ue:$��Ύ����zd38��.P������B=��������::�z���CH�U{�t}��F�u�������drP��ȇ��M�ũ�����5�����G��}ZoՌ�w�q��i�gT�(����>������[m��ݮ��6�F��L�o e���!�:[�4'���8bo_38�lJAK#�J�%�W��91�j[{{��(�7ihiL��*Z��&�6i��C_O3�1��Fa�Q��~uuV�I4�}��a�)ӣ��S����Cg���}��P2�γ�cKbC"`�1�Th6�ގ�jh3b��E�Sv��|w�Ӟ��{�����~h���L�F3�V�ξS�k�y M�{��k�Y�F^�l�[��8K�tGS�k�A�)ڀ8 �=�g�M�v�8�a��i�ǑN`�8 KgĻ_2��L�y1t!���%S�z��ۻ��UҷR�Û���jS�n��Z� I�V&u��޾�ꆛN���}��n�����l��~��h��X�?�n\*ƊIm�=�l�O8��4Ùp3c�*�P�u���}�� ���*���N�l���K�$��C����z���/�N��l���{�a��xa愩��Mo�Z��2eW��	b�t��Є(�Y�"�ξ��0�4�ٔBs���H�pk59|�^��%�~��Uit�QV\'��T�{oG3��6���o��l�.��aT�Nu��.;���n;��5-��_���b��16j}�-�/���OU�ljC�?��4�����g6M�߾�=�i���L��nN-Ҋ�޾��蜓�0�G&�*��o[�H��c.�����G3�d6�;��#}��^��ES�w6�(�>>�P�՟�E�qھf�)�[�y�\:s�jv�s��c������::f:�]�74M��ʳ!��6E�]��?_�=��x�����6]�N�����;���s��]{?�W��C�Į`L��{J�)�9��l+�^��)�B�rxy�l�ٿ5�?��_�oz�f�6BwCK�φ�-��xj~�S����;]�!h�
�[��l�A�)M?»�e�Ϋ�I�j���eo=��yRD�e�8���3U+t-�0{w���n��N�s?�l�:���sᦲ�D��.�4Fz�ݍ/S��+=�oyD%�0�=B�j�NCs?����+Mo�"={����D����e6��=M���~h��=B�ݟ*}�l�e���n��[�LT�XA14d���˴'���=�"={���w�K������!��#�>�+����nbW1.����*���7�o��oo�G��U�6���Tc�R�����\F#�J6	#u�{bu���i�+)�k��a���aX`YB47�W���5�K�
{ogsmt��t~K�?���=���iJ��޾��0)��a �*S�U��F�/�鴶�<�3�\����Xd���0����fY� ���Vc������\�� �6��Z�Y����)�T_sut��tnx��O?������v�tUDQ�����Na���7˅�Z���L@d���ޕ�6�N`�f�Ldz �֮��7Es�L!d��A޻2�^�n�L#d���ۻ2��0�*و�r�]Yo��*ل��O�[O��+ŬrY��~�ٻ2��l�U2����{WF֫��������8�ڕ���ﭒ!vV�@�<@���J�YG[�2)���J��YCT8ػ2��H�*bg� ��ڕ��'�d!���\�2�ހ�*��]{���z{U�@Ō�]Yo�h���Ѓ�]Y��J�� cH�dj4��{52�� s�V�2��3r��T
��+�mwdl��f���T���*��22{��l�J� �S�ޕ�����d���t�<���U2����n,�t�UC��#Q�y���zewU2����ݻ2��L�U2�І���@s�K"`$d�{WF�{T%C<���w��F�W%C<�H����|$���!`$���]Y�ҰJ�x J��wed��ܫd���X�4�Э
�U�GI׶�_���V��2�.��g��Ø0�ʢ��ޞf��V6���L/�E��%�r��1�L���4�5��a ��2���j���j�������ь�mJ�1�J��u��i��
w5A���T�{����.��c�    M_m�ť
�rW��D�r=��ҏ�#�,�1�Z��R���`���q�޾��0�ً��L>�F�7F_�����ko_38��M +[��K��X�(�l
��v6׆AW3H��x3��Js�+��Hy��h�|6=��5׆�H��Ct���DR�f	YT";���(+q�so_sut��tBM��Չ��
0���g�)����\�;�P��2��
7�!�K��R�s��l��NP�Y�髰sV+d�탘R�����:
:�u��uV[��!��[�{��7���H�%�R4�Y�a2������v�5�{����� }|�s)O����`���9��k.G�,6�mz_�P��������+�#����H�Fr"
w-O��un�&�n�i�3�N{4ѧ���O�d��c�>[�ȶ��+�~x�"��Ӎ��u���ٓCv"�^�xٓ�4o���1�z�܀͏����e*�k�Y��-w�
��#2���f8�{&�D�7uz��\-(�o�[� ��n+����/IV��T*�͇Pt[���-Ӡ/����h�����:y�ʏ�/��_�?>�4�0\�c�ąf�/��U�i����}���|S|否�%��o(���,������":�	��C}����דw!�ʙܕ(3�C�a$�B,3}�{����ֿ=~~���mc
M�:�
���9�7�����/_<�������g�t���薷<o<�Ggz��4��J�q�H`��������Q�ijz���b	���d�3�|rZ��,����cu���I'����;�:5ޮ��чm���C����kt����5vOF�R!�Dv
g+tV�Y؜�K�7f�w.u{o_sա�u5�x3�ě%������W)�!:������s&�Z�0��>����������������F���\kwK���*������@�ۤ�_��,�
�[�4�=�03��o�$������\���u�0F�[KE^C��N�L��98���Sp�~�x�!y�)���a��ɕ�t��kƞ�Z#bxX��{�5҇(��E(�|��Ξf�nJr:W�v�j��:�FÿY^�3�rvZ1�oIs��k��S�M?�z{��'��Fa�÷o?^~}�������c��S#�uC-�>��Y����!s�,�A���>f���l��Ք&q?�v6צ�)2�>0��� �+K��1�f'�N�2������Z8���_����P���^7Y�e���fp(�Fdr����T���waҼ��޾flٽ�A6�ia�Х��1v��c6��޾��0�왙�se�a������Rm����\F#�f6�Y�!�侮Z**���ס���6��@2�74���Ig�u��A^�V�ٌ ��5c���e����W�K�zX�����^^��W��9-��M&��{{��������\r��8�$�Vm��:�����֡���:�DC�	��,�DuJx70LS�ʄ~�re'�!w�:���"�d��g���CoG3��6=�
��S?�!it�V�Ǒ�U�GR�[�f��FB�I��"Z!���D�+��ק�>KFvݕo��7��J�u�Kz�|}���Ϋ�ѥ�mg!���Fc�Mס���;/��˽��J>|�G��Q�r,S
�N��ҵ޾���3]� ���<�V��{e���/y�g�S�ߦ�v'�N2��l���΀���0G˜_�]2��ATN���GLU�co�@�lE�2�~cV�h���\�/?���r�1H�:���ޑ�Pt�x�kǑf��x�9m��W9�j�Jg_38����L���IT^��o��OiҦ���}��0�S��{���f�=��)�߾�C�t�R�͡��|#�O��!������/��ݞ�Sev�]��2��޾f�],r�uq(���}��jT8��do_38��z2��yc6Ϧ�ݙ�
E0�dW�ӵ�z�����mu���A�RnH��W������#��^���1V<C �~CK9Ֆ�zCL��F�Ļp𳺪��9��Mn��l����4�CI�~�-�lj���&��p�����4����%$Z��J v$�ȝ?��:��i�Ǒ�-����L��k���}��}$ʓCogsmt]���x4���d�Xޫ��G��޾fl�~�o!�O��w�7C��g�I�ơ���6���"��"�x��u���<�T��d��l�]��u���P�>�����w�/������������/O�|������/�?_^��.���Oo���3Ȇ���%?D�]U��*<w�"��z#ft$_~8��qW�Ԛ����d�ǎ�ηZ�):��(�Ϲ���e�t� 9�v6��Ŋ6Y(+2�����ͺ|ֈ�~�ʄ`��k���*��I(���wde����ʻE�e��ǫޏU2(�q�wed���dHޭ�P��]Y���B2oMD���+#�;��!��&"`���z��ɼ5II�-])Ywf�*�yk�s�Ne.Y�I�ɼ5ѹd�Z���TU2$4��"޻2��o9U2�Lt�����;�J������6�2�uG$T�0�9ا2;^%�|�Dϳ�6�zwM52� �e��eof�*��-PmԽ=�rA��߻R����*b����F�����*b�-�ݖ�ׁ�U2��[���ޕ��~?��!��*�m��I�P%C�դgZ�2����U2��[:��-�)�d�����g���F]#3���tZ`[� T�`ICk;|6�rɇ�>�|�=�d!k1϶��;�����,e�āMal�f_Y!�d�u���H����`l�I`��؀*Q%ۈ�1�{W�ԉ���������߽�������������r������۟�kO7ǹ���TS�#�=G'�"v��[�ě-i�9�K�J����`��l-�l���֕=[��U���F�Cڻ26��U�6mfjV�vU�	��p[W�Ի*�0�1R{��+c*^�l���]z��ʚW%�9Fګ�5��T�*�0�1Rg��+c�^�l��iA֮��|U�M��cV��DÜ¨I�vel@�s
���[-R��`�0�0��	��>V �d���%v��؀X%��4�{W��*�@�@oB��&)�U��n��l���*�0�@Z�ZI�VɅ��i�ɆP�d�\�$H۶vel@)���	���_�#ŰJ6�'LT!խ+c�al�	�%��ڕ��J6�'LT1խ+c�b�l�O��-k��Ȁ�X%���V�k@Q����H�w�lHY���V�>~��؀�X%��&/�֮�(�U�a>�R�K���(�U�a>���;-SbB���	��W���V��0�`ƭf��VɆ�K�+[�W�\�d}�Ao��� �VɆy�,�ҕ�������`�j�L�VɆ�'H�vel�l�d���KcD+] �*�0�@�ʓ&�*�0����T�26@�U�a^�џ�\U���R69�i����YȾ�q%��P�� �`NC�Cs=:mS���՚���k�{!��Xΐ�w�ʞ -�ީg�<�#��] .+�0��(�֕����XT��+cDf%��f��YɆx,w��{��ЬdC<���r��� �YɆx� @���+c�f%�< Q�i��� �YɆ�,�FNW�26@pV�	�/x ƞ���d�W��n[W�H�J6�+�P��d+-��dC���[����l�ܼA���4ՍZȁ�Wg�f����p3Q��I�VW��F [�W�i��f�4qDh�OV���y��ic%�X�c�Z`=I7M����(ΘAWK��Eӓ�?�x��y�*ш�j�髝\o�g���(G!k���_=���bq��s&�5鲎S���7"[��$R(� �߽�N�ovTȢ���]�;&��Z����Q~2M9���R
�^����,Gھ��L�4J�O�
�_�Ǆ�J��bUg�DؚQU���޾fl�%��CR�U׹�UH�Ht�5��H^����\QD�jG3�����5��H����V�x�T:TIr��ڡ��J��M�ɐG�*��j�������n���4�f)�����݆v�Z�    f�+��@�|M�A)��݄2k���Dl�ЏnǑn9��*����P�`���U�y�7�\mE3�2���%�S�J�5-�1��a��q�ގf|(�4��"���(�8J\�6N�GXK�X4��A��De��z���k���r2����F��Zތ�"�������'(��\F��PnŦ���}͵e-����joCyT�_U���\���2"��ҭ:��=��[ө�T��S�:~,D���4w�w-�a��^�
��li����]:M�ގ��0?Mj%�������<	_��cH�/Ӵ��ޞ��0?�)�}�	%z�;� ۠p!��
cPB�c�{{��W�0��Qo��-�LW���Ϩ!d}Fo��ٳ��5WGR�e?{�l�4�΋�1���������=���Jօq#rךn�7$����@Y�|��i�Ǒ��@v�Y�����o{����tq콝͵qT씬�V�|�kJ,���B^�0�L������@����gT�km{M�M��/���y&G)M^�1��5W��˛$1����V5��iF���+�&���q�=����rHϢ�`�
=ǈ���<��^�o(�r{ogsm��|Z�g0h�tj�y��M(r�������:�J���[VMyn��%~��[U&ܝ�ݠ�?��5�FQ���(*��v��(�i�SP��PHɩ!����\F�<��0�0���}�]>�P2L7;�.+���v6C��>�h����3В�/�)Y��޾��0*�\UV�_�ȶPM��l,��]�����Zogsm �E�+7g�D�GW���E��G������}H��u^s�!q�K�i����0�b�d�.��!��C3>���oOo�/�?}���_�+2���K;w�L�X�����C7��r����jي����a����onoCƘ3j}�-h���#�y��qk� ��0�Z?�������_�_~zz��|�_޽<��f���VG��e8V�q��`�u��0���Z��/�X���a4~���ţ_~y�������嗧��"�u�Q�K�����w�tA�5��(B��A2E�|�K�|R�1>L�%'���oz�o���������=��/�� �z��y����A�٬K��Io��N�!��]�����?�=����[6>j����8�=��c�l�t����h�j	_�uj"�}͵a�&"(N�M�(��I&EX���<D6Sj��޾��8H�J&�2�߱�uӕ�b�{s��6�ڵ��4����4��J@�i�xțEځɅ{��o��a����5�����@�˴ �{��ǐ��Ne(�r�Fk�?���4w�A��>���i��{VB�
����u�4)rZ��4�LE*]4yt�C������Gg�bw��yxt~�5�������?��lQ��%a������{9�æ0���������øVAj���s��R�V˫1�M�1�{���3��z�VAjŦ��/��[1���y2كz{�{��(*�bG��^G�
W�H��d��i�Ǒ^LCG9D9\�T��A�1�ڼ��4�CH�!z���|�l��L�2�G�;����2�魳�lߋ8�y0W�Ф[�����jO���{��$��%m1�_��9�mκ��5cC�4C� ���H��B%�s��˛�q$�zT�u�ʞ�ŵ�
*�q4��a��l�����}�L�����?6㷇���mmt���+��$Α�B��O�f����H�@���^�|�����?/!|*���%��H_}i!�%��P��m>ךӿԺ7��½�~���Ǐ;�y~���syO��Vz�p��v'�D�h��m���\���̺��u�J�(����(yt�IoOsom!���}��gv��w�d���u(�R�ġ��-���V�z���Ϸ�����˫7c�?�^�>�����_oo�{����˯��o������|K�qS{�էGAN}!�ՕI���W����p���ޅg�t�!�}���>>}�|y}�8>����?�n�|�<�py�}�������뗗���=�x��f��hɹo�>nЗ���8F���_j��0ӄ2sD�I.�~y}��O?�~����.��n�O�@�lK���v����ך�����-9��� �zZ΃��xYv;��kN�8F3ɻ�C�q(������s�`	o�2A��bâ��r.�S�g�|6��{�����	S��o�
9D�����凧�"�!f=�Z�A]%���G��ʝ�Ihi��z�n^��o����S��޿<}~����}�3����w��OO�$X��~x���">Y�r9���θ���᳷�����SY��/D1��避���r~#n�_IT�.����\\+�tU�}xuq���B��I?�������_n�w����/;�T�?��PzbKH}(��q��=������L�P�V�������P+,�S��j��V�"�YmZ�%�2�Hf���Y���\D� �S�%�z����;�/��G�]>�<���!g\ֽ��5By��x�^�u�|�1-�><��4Ͽ�������秏?]~x���V�>�(GC�kKNUn r�i����h>��Z������K�9�P Q���#C1x)�X���k�or�,}<z�Pq�ʄ���t�m����\��d�Da�'ִM�e����g�}�|����}�h��֯���������T�����I��/5'��'�!ܣ)�q�&��N������������bA�����˨|��U��"MNnH��}~��}������g����������9Z�`�����J�I��~Ax�/�r� ����$��'=H<p1����*���8���Ҋ�m4�c�b})��_o>\����,?�>}�u�R�{�����[���H�y�z�mS�顷���^��w�\�d��~}�v�_^����C����Ɩ��=��at�Dfɯ�O�nR2�5��H����s�n���p߸����{��l�.)��.: ��ϋ�����[q�5�a4�j]��ʽH7i�z ��2��n���ˬ�)��ۺ?i<�y���.F�~�[!-y�j���g��5���`�i�������y{y���+���ut#�b�A����o�<������q�Sn��4H�o��M����.L<��1\ U��v���')=.)::5���ȳK�i���b�۷�������f<A�5[o)�&Y�ؑn�޾������<������,���������˧��͡;�{� �ש6:�4�f��#�n���|�K�L|�B��F��������c�\Nj�	떾봓��n_̢n�����D��Z��}�yz��Az�����xΟ ����q�[�Mf��Y�7���海���Lۧ��3goj�-��?'���%H�/���M�ŋ� ���Ҍ���R/��$��!�`8N�-����y&�ۖϷ[�u~y��T|���mK8�]U&�*���Y�s8hp�]�C8��o���2]����� fξ�D�T�����?�>p\7zv�t� �FQ�U���f�n��"�lqab��?�f�n�­9A�uetu�a��G��btԼۺ2��G{��QJg�7!�~�ڄ��&Ė���Am�/&���;-��uׯE_3���H�������ݗ��f��n{s�Y�1쎽I�8Gϧ����H3���6���}��o����]��K��g%�V&�>��4��D`�Hw��XD�7z2s�dN<��5WB
��h53h��*�a�7�s��U�1Ӗ͵QT��+��r�􇤦W���������"2콵�d�����l6��t��?&�x0���u�����}��A�)M�g��n�c��m��-��6�VT�@��i���Q�e!ڳ4���To�
Y9�������6ZY���g�q>&�����w��H�y/��Дe+.�����[ |%=kl���O�>}�u><�����o��%(f�3{w{G�pG0d�s鲳�F:U#jP���9������T�?!��<��R�%\Ә���%z{�����r��9��������������T �53�93.�s�%�%�Z8Zpcc�X�+O�� g*p����Q    ���f���U�$G;I��LPkOn��)��cD�+���06�5nt	��R��ܔ�y��7}������������l(N?`n�f���e��Sw,�B���~��-�0�@*�,�m�Z �J�����ϗ�>��?��}~,u��d����HK������i�[��_j0��3�p��9(o�u�*oݻ1Ipt����k7|I��Ј�<��9h��Ϭ����&���������nb�E� �&?��d*�幷��o��w�
Q��eS��
eˊSq�?���8���Zs��6gSʻ����p�}qp��5B�yQ�>J�~]\��
��6�]�#���V���ӫ���?]~x����C`e8!���k��+4�^�Gr7�=7KzI����2e�l�FͳIl�D1�%��C��d�����،�YdL�lI�5�lN'�ZsX�S�|�rl��笆��.��H7��QVޘj�ف�hm�kϹ��;�ɕ|�-�+��"�$_mc_4�9T�Ƨ�Q+�|��s��D�\GJ�|5�S4>Y�ב�p��y�h|*�SFطA�"�[N�c���ݜ�3��>��ߚd!��5�|S�Ob|���W$��5�|�§1���#��8�Z�wK&�o�֏�3u�B�.����z+����V��[�Roe�|�W_��\���|�<ZWC5>��YC5�|����1�|��Q4>U�m�:ᓳ�r"du;~6�㫚��9�����|g�/�;�rt���o��)Q�3��Z _]�*K��*|gzӌO��W���@ڵ�Y�wf�r>���s-�h͌��IQ2�c�N��^�h�.�c>a�t���|��S��W	O@U_��X�z*&` <��	���+X+XO����S0���ߩ�O)�g�Bm ���PHd�,�Nacj�3`郕?�o�|(���˵�VW��3���v���	�v?Uk>�!J8����9R�������ۛ4��>}��z����O�����/��[���/��������_/߾���F�e�o�J�|b��� r�s<��z��k��`ͯ��W���~���;�0���ag!����=��a<f�7*��?a���S�p�x�ֈ��X2�:P�6
�Qk�A]��8-5O�˗�o�4�
?D�[Xy<zT������Y�YS�FI�8�^�q$��B���XE3�%{�,��l�y�և!�T'��b�ˮ�5�Z�Ls�^.Mb�
�@��TS'�>��jW��j�䢙䲽�^�i�]� s;\���8Kq���� P4�\��+��Uv�\�D�\��=��׮���)�z��k�FGs�W=���-Sp�Z�I��~�ʸ�	+Km
��k�&�כ˻2��R"���2�Y]�2�����Lp�ډ��\��U�euD���NXAr�])W����5��/k��eMe~�*����~ى�j\��	�^�e��j\Xx~��;��)tŞV�T}�>԰!�������)�i.��%i.Yp�z5����}���qKxǭ+���W�
W+�.g�ʸj^��-������|^kW�՛.��{����֕qѴ�-G��g%Bᅶ���-�z���u�\` m��k'$m'd�N���9���������ue\X�l����4��ڕqa�W�]���r5��]�<uL���1^� �֮�������1�^{�ͥj\u{�y�d���C�'��[��3�${��I�ve\uk_�#�z����R�Ⅺg����������f��g���������we\ukO	ns.�k��&��ڕqխ}�m�z� ��p���0'�4V�&z{�����>����Bv��B�8=��Z&��ξ��:/�ދ����ɥ�)���f��91��e�G�~]j�߿��H���ӌUQ,n�{oQtZ(qIl�id;LTo_su����^l��c}x�&�/�{;��C�õ�w�&}��"�����cZ�����\A�m����5*	�b�!��>U�4 o�U=ͽ��!�:c\F#�l�א�p�(�����:�m�S0��C�� �P��ޞ溜��?�^�:�i-����)ӡ���nR{��C�bvY��%�ɰ��c����4�#�л��JE?Ӫ�ޱY���CoOsoҗ��0���O��>��(��54B'�r�ЉZ�c��ݚ4RF����c�w?���1XI?I�����i����+����)�øs��ə�Lӡ����<1�^ccU*��9e�߂��j5���ܛ��X��^˥{��mB�f9]�UV+s��i��AS���J�gT��u��?�$R��.zW�#�b�
"O�w�5W_E�5{�}(�εC!�A��N;��iL�&�[ͦ�x�<5����b�ko_su�TR�t��q�����戯�z�rH����1q�u1_X��v~�iin�|:Y����}��+*VV�*���T�㽥�x�
���5W�й+T��ߞ_~����۟.�1��ֲM5-�/`͡��vl��\#uϸu��r�lQɥ��,�5b��~(�K.��5Q_o��췀B��2�\��z��~(�s.��o�Q���X�O`1D�&�o6��^�X�p�4��ӌ������?�<�������l��2�KJn?gF��5��H~$}��7/��<�#MØV,<��5��!E��/�̬�d�Һ�D�]�S��*z27�*��f"Mg�����1~���\#䡞�J��4�����\�Ř\���4�#�Dm���������9/�P}�S(b;�j+�sW�=m�(�S��C�ӌ]���F=;�
����O���u��ʍP�+�Az)�3��0n���P�z�y~n��#��;��G���N0`#����Z�������:�\��h����s�À
|s|n�<�Ptr��m�l�o�rR�m���0T���u�z���z�@�j|�ԓ.��'[��P4��V�O���U�$&�#��{��z����I<���=IyOqL��b�Ą��0`ݓ��HW33�'����uOR�\L�f!�7� E��X�$��Ǔ@=����Ww$��ک�+�*6(l�˯T��� +VF��DH|
r�nn��#
�̔��Zsx�+#PG"4<Y�>7@ԑ�V^U��HJ���Yԑ�ifB�u$b���j��hO�ffPG"���뀜��P�+��%r�9<�����#��d&u� aO�@W̕�D@ԓ������ �I�����+��[ӟ瀨'����k���3$K;�~8��
��������PW�X�*dKC	�w<�넅�Ca	UH�jl?3�C��%чb!��/%ğa�Ҕ�3aa=��!'lVt�VLM�<KY�`(!��A�� �PXC2��#��yr�J���J��{��~���(�h��a���MCN~/	(�TעH�(De���]CA�?�Z�עy~�����>��>E�>���3������J-#m�<?�� �	a��J=g�(s���J�}
�Q'�Բ���3,�P��)ܾ�z^sQ�5������Lo��O1�#dUN��u)IU�>B^턍u)^ɼ�	 �Q���BJݣT���ˡŀ��t�c�Ƈ������ϟ^o����_n�><��]>=����ryy~������O���������E�̳*ڇ��!�l�4�8D=����K�Ci�P���gҪ�nV��U�QYཷ��GM9%�Y
��^�:�,Śd�������$��&�"k�R�l��<|�����KS6�Uy��pcp���ʃY�)�>�yS:���F�5�!MK��Լ'�I����M3� ���=�mX��b����l�Xd��k����a����!���9-��8+}΁l��qA&�}��Pj2W�5�	3h-��g���BW�5�,�`��k��=��g{wy}������Ϸ���/���ˏϏ.�?�>Ԍ��.,�,����'�,��1�� z������K�XF�^�\#kIf�x3!FrL�LCK{u��9c����~-�C�xR-�׺%@�p��|�W񋶲iA�p���}��#���Ư~�+�Y9d�KB|��*M��G8PtP�G8Y�d�w.n,�y�*���sucN�_\    V���3ay�3��Ƃ�0��_!|�;���$��*��B��8s.p,�g�*C�i���a�E�t!J��*D���Ü�Q�� d�"���a��0!��Fx�sH	e�\A�*G���rB�-�
�m��;��P�ϐU�l!֞������j	#��=O1A��*K�#�o�2D�<E�/L�#���RD�<į����]r7����_.�o��j��f^3.D�$L�T�xVs�:�Lz� �C������q]�Y������7���Ϗ/�>_|��>����v}z�����������|�}��?���z�$�a��������/o�7'o�c������\p-!S���"K�d�٬�I`���`�7@㾑��"1�I9�1���q�f�{\m�]�����3�tX��Ȉ�a.��Z��e�K)/��z=���h�����SC��U���h<Y9��{K�C�+���+䘧�s���#ބ���e��HgA:ܼ�#���!�����?Q�:�7F<�Mx�/�1�a���\�
l�x��$��`�5F<l�2�����N�Z����AVHc�ÜƤ��ƈ�9��R�
g�x�טF|i��#�5�Ov(�Jg1����e�1F:�g�Mvc�}��+�1��ZY����0�aq�ˋ_�x�� �����H��+���]�x�˰
�c.F<�eX��\V�b��\�����9�eX�S2;b1�a>u�p�H���n�������A��R�H��wv���)Xh����|g�g����xg��9��g�E�����x�躈w�6
<��[�N�F����u+�9�9�??f\]�;q9�n�U�@�<�B����~�$�#�"�=��Q�x��z�??^4]��#ڏK�0���/?�.�a�C�}��E>���-�n�1����)3�.�a�CIx}0c�"�?��Ý|��ȇ�f����#�?xm��G>�(�??��?�a�C1�`yB����??��?���E�����c*�W����������P��W�G>�}��)�����Ͼ��q�#˫ŵAL]|�;[9�����i8[��#xY�#�����`qS����G���~�~�;�^e|
_<��&�;󿙸oB&�ר��8�m�$_��\���ҷ�Z����
�L���\��t�}�sW}�9h���v���~hěM
}�\@[�<_���C����>���s#���M��m}m�3o�q/s������?R�W�G^+�˕I�o��Z_)�x<	�����Z�`u<�Xk��F<�����������tK3JdsT\�FV.g䨎�Ṯ�w� tҌς�b���O&�◅z3��?�vK�����r���s��d�x��Eϙ�����;n��չ�W���J:b!���Gw� wg�Q#�� �J�h%O`n%[[#�
ŉx���-��Ǫ��4��J]H�� "��p�
��x#�[)�	<V Dě0<��\V Dĳ^++��
��x�k%\!�X�q���U�j��
��x��Z�҄�CV D�üF���cBD<���V�;�%�x���6,<)���^��Aǒ�G:���V����G<���t��ci�W<��=݊�!�XZ�����f��:O��0��[q�K��Ͳn	�jx\1��6��l�K��@����C���t���j�#�3\�(���G<�*�R{t,��J7bFٴ*�x,�|�Ì�A�A��>�
��/����b��wv$���Àm��b��wb�>�
���|'v9�k�|<5�;1�f��r��wb�s>�??��?�l�s>??��?���������W>y�=r>��W�G<�<<����|�χ�^��?�ޣLB������ؾ���x�������G>�y�i|-��x(�k�#�<,���Z��:�V�����_��D��xZ�ȇyъu!�xZ�ȇy��Z�ȇ��`�Z�ȇ�|oϔ�G<�}�6�/�|���ޙ)�|���ޙ)�|��h���1���s�U*��aj�W����9�;ek�#�>Z%N	>������K�ʲ%&�U�,������|���k���_��J�M��b"ߙ����/� �ٿ��5���WGz�3����
��O��S���bI�/�����o�oꫳ��������(��<���7�s� �o�݀˿��e�����ြh����`�{��I�>��.�?İ��|��xC3�2�q�sD��w��f)���\M1a�Q?���vx����i�x}�����0�Ռ�QdE ��n�t��Ho��m�:�	!�d�M���0
���2�m�#�*���_k��\���0����~.?��s9��H0��w4w;4,4�.�//�^>����?�/��H�o����w��*�`W>���w&+bd��.ţ�G���H�G�q4�O�|�;c��#��|
�kF6��8��ȧA>�qD�Πt�/>G�F�O೏#��|�'�����G>�y�������#�<D#�=��RƯ|���|i|�C�G�J���ĝF>�{�F�{��S% ��C��Z�`���R|�؂���FrB��]�`�����	/�|����<8��u������D>�}H|��"V�u��\���D>�}�F��*3� �����D>�}�Fr8��e�P��N?f�A�C݇A�ƌ3�|�����k�j@���~���v��e�BD>�}�t�H��N+{����I�|��ء������;]�
�N�o�m_������A!Ȋֈ��� �� +\#�z�P5*4R��x�x�@�F�6"���#;`#�:�s�숍x�s@x�B6"�GTC5J�b6" �GxIɎ�X ����xŬ����^��7" �G�[����`7Ґ�R��ȍ�����d�nD@؍�Gav�F��H#Q:�
ވ������v$}0�
߈��#��0+|c��iįQ������F Ȋ����i�� Y!v$�Ӽ�;P/�∀�#il" y���:ps�8"�Ft#ȎdEqD@ԍh�;�cGq�F:p����u� /�c��~$�tZ
����HH+�)@V$G<�#��CM(@��>����'���X�x�G2@������H·�V0�(�������;:���Io��.%�^%�x�����e���_б�{��P�AE!+�cY(fNʃ$�D]]qbC�1!�h�Fe�h�U�����v�E�Nq�#2�y��Q�t�N!�h�Ƅ��5�"z{�Y!	��Ν��} �:��Be��v�,f�����H|'�d$�ՕP��/��|��\��
V�qg@T�aEWl|g0�k(`��=���o���(>N���gA�FU�����-����/��8��Ϟ����q�A�q6>�9|}p6>��N�'�a�S _#{9��	`��@��H_N�q�6<�<k	�V����
^����t�����t�������/l|��Ѝ�'�!�9�}�F������d���0l|��h|���8�>,n�8�>;�������4�k+�a���i��S|� ����d�U>f ����V�u�������H��2V>qz;���sf����ϙ�?LC�C�q"6>���f Æ��P��8�>�)>N�§�<sɧ���@��a� ��G��`v�x�@r�FNU
�°��U��d�0D@u��#lȟ)@V�x�C
@�	�B6�3'�6Ի +�a<�" �y1���i$(@V�x��&��Y� ��$�F�İ���`;iv��z�F�;
�İ������d1D@�z�F�a
�Ű����K�dE1l��'��*fE1l��'iDT��(��$��1l|�#/��A �H� +�a������ŰB�$ �V�ŰB��bw�� ��g ?��5�
b� !?b�E�(@V��۬�G��6    @ȏ@x���6@ȏx�F�w�ưB�$ b7��0�r$�Y�d�1,��>�6�+;��� /�a<���H�w)@V�ء^L i�6�Ǌb��N�`�Gk�)@V�x����)Ȋb� O�2�E���ưvH�S@|��v�o��I$��.�@��v�;�*x���v����:�� ���c%'�t��p��j;�}�Ց��*�#�X�^v���W����ɢ8���H�u�{-��v{�U�?���5�d�U`�Yd
!k���h<�zDӽh�\�;u4N%�� h�#a����h#���~VGc	�#���1u4�v>�Y]�<�|Ds ���K1���@3�\c��#� ��O4�N>�u;���.QGci�#Z�7�h�3��#�Z�-u4�0>�!Π�RGci�#�ĀN5�>��@���'��d�/���:K� _ �	4��}E_ <�X��������G4��j h,�{D|�h�=�h<�{D��h����X*��8�F��W��_�
]���������u4��=�!Π��@c	�#�`0��}� W [_��h,{D\�l�s�h,{D\�lŞ��X����ْ���X��MKײ��>dj}�-�����ֲ�9[#1���G���-����өG�����ZQ�u6�D=���n�?7�:}aSC���l-�m��'L�l-�[�A&��I�l-˛�a�I�=��Lo�F�J���چ�l���O���ЊĮ��������Oz���ݳ�U���^�/8�l�_p�_`j�W6��RX��x2����}��+�#�,�ؘ���ۨ�B��t�p���:OQ� �`���|1yd���Y|yd���O2L	yd��mS!�x���x�F�5�'_�$�%T6�f<�!N����#��CS)��Ш�Rcc��#��R6�><�!n��3��w�-�TQ:ʆ^���T�G��:�؂[��x����\�9[C7Xg��#[s�fl�$��ӁG��:����Ɠ�G��:����:O�ٚ۷���:���~�lr8]��V��tzw�]���7f�k��L��d�aE#��������d�$p
x�˿�K��������_#W��NN�
:��f&I�����8Q�o�h��A�F�B>�E�>���5���A��ԣ;Cj���K� ����9G����W���D�8���9ET�W_�?��`ϻd�/�`���*N��ϣ�Z��o�~:E��Q �7����^��[�z3cr�ߘ�i"�l<\�d�zt��+���1���q�o��N�Zec�]���헿/�a��׍I��ωp� ���Y$k�oO�5�r���%$k׿-�Y؜��ll����I�L�q"Z6��r����G��Ҳ���t�F~f$�81-�ml�Ԝ�NvJ�q�Z66��7p�Z66�����$'�ecS ��d�ĵll`��'�eCCv"t�U��ٲ�!n�V�l�Ж�q6o�ؖ�qt���	n�� ����N�q�["[sW���߲�n��q�$'�ec܂��;�D�ll�[��
�dㄸll�[�t`�Ɖq�� �`��+�ec��ŷo�(���ݾ1�\66�/Xt��t���@h$�8�.��"~4!�H�q���첱!nݾ1�]66�-��7f��Ɔ�t�ƌw�� ����3�e��l�����aG�lp͛��a�V��5��s8lƱ�J"�l^��p�c�lp-�[�a��Y���p�?8Vd���2�v�a��lp-\�aށ[��5o�38Z�K±�K68�;�峃K66�˖��$+�d����31�p����N�D±�K"�B�x�b�lp�0�g�E�lp��+}�p��qt�!�2��A�S#�XQ&� �,Z$+�d�C�k��c�lp���O�H��t*�j��!�k�bM"�F<~��E�lp���3��p�p���C�ׁΒF±�M6�n�`S�8��=���)�F�lp�"����r��u{�?8V�ɦ�j�e**�K�X�	\�{�p�ċ�����6S�ǊX����iJRQ�5d EǓ��tM[�ѕ��S:���;Q&ttE��+�;�ɊM��tR������N�lBG�F�t[o��롯�:���ŉ*7|T�,�!_sum��j�&�I���i�4��,4��6z�f���`��ƴ?Os5��%���hf���%R��gh|/�1��I�#5v�K���)�h|���Xz܈d:���K���s���?��R�F��	��,�mD��HtBc����H��!7��X�i*�@�πKZ�*�;G��GPH<EmD:��B�ӛ'��H��[4.�)$�~6"uXox��T����x����e#R��n\.SH,�lD�0�tB;�%��H��ⳛ���H�H,�J$:l��K���m��7p<�kD:�ݍ��$K���mw#Ut��q�H�[�ӛ+m�H��[6tK��΍7]l�$b	Y#ѹ�M��үF�s�-��$K���m���~�H,��$ύ��\�H,�jD�0��TbISg"�L�*e��4xk�W�F��Yʙ�������b�
&�9�ı��b�2&3`[8�&62ULS��?'�62UlS�����+�X��͙���S�F�ڥn�:_��52U������\#Ses�3��L|ykd:��ܥ�e���܎��`�b�Y#ӹ7��<��'b�Lv���kW#S�7O|�jd���@���T]��;�ЀRL<�jd����_��:���L�52u��Fd"��S�F�;Oq��4"u�񆪓b�IN#S��+6�L<�id:7�cC�H1����܌�"��ӕF�s3>�ws|9��d���(���S�F�s3>J�d2ţ��܌��_3���8��Jшtn�G�2�
љ�L�f�2�Hf�%uD�d�S�<eL!�$��JB�1��S�k��iW&]�[�0Z�K1�t���f
r&ZRG1�]F��)Ș-V��x��T�9�������{�����F���ݠ�o/�������U}G�1��A(�:w��m3(�a���E�j�d���*���u�b�x����.��?�r{���������û�/����ӈ���a����lF�U�v%UlRzD���x�԰I�Y$)KI'6)!M��i�ԱI��&I�R���#E�q�$)K�I�+��I���Q����� [)�F)��W��VS�<�P$e�(�����ꬤ{E9��I���DR��r�="I��DR�<�u�$)K���K:ѡ�Ԋ��́�b��e��
��Ba�7ؖ�����p�H*��>�A5Ӈ���2"){A5�����ȈH�^P�ڌ��gE'Dg�_Pt�y��"I����J��d�������fI�#){E�)NHP�\=��T#C�;eI����=M����	K��>{'5Yx��J6ER��dE��w�6���#�=K�?�*+�~��I_i\%��S#j���PGZ!J���+���9*-�$Qy"͈�o�rT� =���IF�~w���RE�'U���e5�;T�Z0����%���U�x����ET���ek*S�Q���b�t,��tB���[�����?_@k���p��b��D��`�X��??"#���;�±¨̠����[8V�X1�"j�w�±�ƊQ�ˊV瓨<u~D�/+�֟/��v���h�:iWy���_V�L�D���#*Y�S�R��_Vt~������e5��>IT�`9:V�0�g��s^�lDe�Ẅ́_Y�"�gT�M"ᛮF��:*[Q����*R�I���3�p�B���M�+-j��ʯP�ŧ
��J��ȧ�Ӻ����U#O�k���k2R�J� ��3�:�&�#�C�d��7��p��l�g O,�� ��T�o+S����� �Vf�������ѥ*��1��/�/��yc")��**�䦓YwV�}�:�A�~��Q������P�1n�}<��J~�[De�X'	ޮHnH\De�&	�$7R.�U���� 2<����Dܫ��g�{�t��{���
ܴP�!N��*�yE�� _c|<Yb� m� S  (<�q�F!<��$��O�|���F>ty�x,�a�}�Gg_"�X������A_�R|� ��z:�`<VTV�S ^�7�ǊŊ|]���E`E>ty4��+�*.���x<�݌���M�l���*�U>�@,�����mN�da���倍�*������ �
���%`�	����W?@�>!�mr>���$�y�O5�z(@���(wjc�Ҝ��8 Uٷ������Ȼ��ӧ^.�c�Wi�[��kn��#<���#ǼC��O�L�G�%3��7u�*�"�"�]$ǽzPo��P{-V�S�C�t�7������҈_��"�W>�$��V�y����n�� "x��H�F���"x�%�X��XI
"x�ȎF���"x�k�	>^����Q��<���z+���M��@�1p}pú"�>_o)>V���O��c�7$2�����&��|�����`}��|��h�gP|�o���A��%>���}��&�����X�5/�"�c�������\D���[�a˃f��"�x�� ��^��~�GDo�����}F@�*����̠��^�gL~8jD�`# ����D@�{CCG�d@;�v�f�Cx" �A�g�w# �I;(@^dQD=I#H���G@ԓ�7����zӈ� y���$�0̌Ê��'?���#�H���3��" �H��H@�x�#A�O|pI����)����#iT�#y��:T<Ɨ��O0��	}x_�O=]���hȌꉀ�]ӏ�t�ȋ<ܾ��Z�����>�˯8�	��~��7�?�� K      �   a   x�3�Ȩ,�LN����4202�50�5�T04�22�25�30��44�50�/�e����I�9Ɯ��y%��c�際_���G�Q��n�y�y��]� �6M�      �   �  x�}��q�0��U�s��W� ������Ě���7 �����G�qy�������3�;�;��!4�%�dI�?O��'���-��УD�ɴC�7� '9�*�dT��]�*�&UJ��<�&-@��Cu�*mPE��#����k�Gɡ��:�~�1�j�KqdY�:�h\-F�%�`�N�C��<�h\�hO��B?�Cۂ�54nA�I��.�۴��g�l�}��)@%@e�ަ�m[d{�#����Г��e�2m_�+��G�T�=:*�䅴�D��5BrN-�<I]I*3I��(IV|Z�5���Tg�*/Q���d=0�Ir�JR�I�~%�6�P��?J]Y�3K��{���{�z+��8r%��$U4^�Iu0Fe�ő3G`�m=��$��r�<I���wd�U6Tټ�Ó�E�11�Rkg��%@u%�O�v8�_�'�2Ȓt�B/�CiU:�������W�\�MR�	���ͤ���ǉ󶨜a�ޣb;��ė3d��O�ňw�,�N����!�=���c���suq��\��۱-��k�P�}�v�+��b|�z\ySyq�N�z�����V�o���6����/y3�|��O�Z�HN�;��6��Z>�v{���G1�\�W�_{�\��Z�/�h��Aᢃ�M�1����)�cZ�?�8�9�O��7cO����J%_���W��,#g�0i�<J`�Z���ҿ0qn`|j�rE�'�"�JV�T��T�"m��b:�J���������,      �   �   x����� �3T�@�SK��#l���{X�3O��³`! j�Ɓc!/8;�5� �T�,�k�e�.�>�^�_T�1'�8�$V�Q#��ؒx��`s!,�n�w|��t,I�ײ��܈8��Hc_IUל��:���\kV�k�j)2���Q��s�Mߢ�ꚳ�\G�P��P�g�=][R�z��N��      �   �   x���Mj�@F��S�F��YՋn��&m�dH�gJ��;i�	
Z����f(0��E��)�V��"�e��$�m����`�5(��<�i/���i�@èXG�A/FjՕ:��$jO�Z�bբK�Cypނ�XF+u�k�72�)JG�!�N#^�||;��#�xJ�@I�m3��*�<B9��^DY��%����ޙ��TϫT�����9�ߕ㝷�Q2x�XI�-�@�[�V��i�o%�rO      �   �  x�5�A�v'D�݋�Q|*�%��	�nѓH���C-ys��o�����S�&��p),��1	�B/;
����a*�K�Q8QKB�� �Z�lJ-X6Q�2�(g�f�ԂʦԖaR[R[pCj�zCj��ڢ���B-��P�-�Bj��ڇZH�CmI�C�ɟ�C!jO��H<��{���Fz�'���A��/����_㕥č~�(q�_J� n�X ܣ� �5cpG��� ����� ����� >6�π`�l6�m��8 ��1� 8 ǀ� 8���9��#ph?]>[�O�E�-�����R�}���^$�[�"�^�"�x��"V�%+�"V\E��F�B�)�Ҋ�FiEJ��"�QZ���'�4�9�q՝��/���Kip��ߡ%�Ԋ�FjEI#������w�B�
i+�Q��Fy�.�u�Y����͢��u-F�"ފ�$�ċ��})���-Ɇ]��D0-�f[��f ( i@(
@P ʶ4 T�����CbWIb�$� iK0� �28% ^O�oc^�)��N��ok^ȡ��Ќ@��s�mŘ��3ctێ1�ۆ��ܶd��c.�s����j�;#���\S��ٷH��7�u�Kb�O���Ib�^$�M�o�%1`� ����+(1� �V ݪ�V�k���U�S�GX
u��5�{��v�/�����[�nw8��'��pht�}���	��=��['J���=��; �w �� l�1 ؾc �}�p�q`��	 o;o#�8z���o�x��{Ǖ�?ۼz:���~Rl��s���a��9���0<��rO8���]� �Z=�� c�1> /�`�t���� || >6�π�3`�=��l ۀ`p l�c�pz��|�~4؃�pm��=�q'q�Ո�U��F�H�̉ȵH"��2�	 ( i@H
@P ʀ�[;5+��9 ��ͱ1���,'Eb��$�Eb�0� <�O&��	prȯ��_��!���'����NN��i���ۓ3�����i�>���z}Z����,BI��#1�Y���E(1z׀$�Ā}H�Ib���9 �;@w� �� ݝ��stw.����ݹ �>' tw@w'�.��<���, �˳ �.��Vb@�]�[�ğ��� ��1 �.� ��n���rL ��1�.����h�i���"����#F:���pu�D ���{��é�x����x����,*��
��� �[�
l���S`,*�SĢ������L/��%�%�[�2�Q&�2�+�5�&�?U��Ir��T�L��S�x��U�Y���=Q�@��%�@��K\���K\����]���MI/�o�C�
42���j��l*���wT�+8T�aJo�Wp�2�O���Q�k̊�}�(q��/�ٿ������H�K      �   �   x��̱!���L� ?�`�,Wg��p�IIqE$w��7Hɘ�E
�"��c_a��Pxd� B{5��{'ݛ"a^�w4?��������P�"�@kȢu��EOjd�}k��ރ�+O=�o�h��}�z�GM)} �;36      �      x������ � �      �      x���]��(����U���൜���d!�-���5_D_�~��%%���?��S�?����?~���V�����^���g����r�n1�iS�{��J�ߣ����zuɸퟺqvx��J��<t�+��Kƹ�����_R����_1Y�%]2�sv�����/���ՠKƅ���7�Ẳ/�q�_���s/_^����$�R�w:�<������Զ2�ϒq��d��W�^��+Ә�W(�2W@oƍ֤I���36���_�����2��"ǽ\���S���.��.�q�F��_���.�~g�~���R����Un��]2>��ƭ�7�H���ܕ:��|��]2~��<e�W�2�mn��Y2�������Y�w<;g���l4郌�����V�._iL�������o@��HD|N'�눙�B�4cZ)�{�I&LfJ6� �$��\a��K&�0S~ 2�l��8���~�)� /�sA�L��札5�	�;3��Q2a2S����Φ\tɄ�;���"D�dB}�F��͞��	̕�섁�p�W2��򎍁��P�.����H��fK�d�_'�4�>H&>�% )��A1�+��!�$�G���@�9�+���l�?9c�>D���>K&���-˼h[k�d"�_��rۚ�Q�,����;v[�q�=K&�����I�a8"�>J&����]_.!IU��'?��f|����Y2�y�����I���0�%��+��̜-)�-���(��\y�${6r%��I?��3l�lvC��J}�J?�2��H�����~����ņ��gɤ�=���2X���#1�2= �S����}�A.��}�L��a����n��d2[O�?��B\_��&k�N�Lf+��l�c�%����T���z]2�;Rg�M��.��y��R:d�d2����ݛc��]jY�L�t���,�%�Ŧu��J�ݰ*�c�d
�^���Y����)_ޱ�u-�)|��c��Zt���9[�񲘯f�K�p_���-�5����;�o���d
���9Y�tF���;6�k��� u_�����{�s��ݎS�Le��g�r�w�d*�/��)ڜ�.���_Uv�Z�1)�b*�-ȸ��h�%SY���86��f��l(���Rϻ+se�w`oF�9I��qۘI��q�ɢudKs���a��gB%S�^���{��%S�+o�Q�`�D]2���_)#�U�L#��O�Y~o����J*�F\��Ƃ�W]2�����{!1�A2��RgGٌ���t�42[��1����g�4�K������P�UG�%��ly��OǱX/�d�-���ΩY��dCt�%�&���� ��Q���d�ė;n���U��۸1��p���U�/��\� ����ESTI�5	pnM�*f���#�νyZ���~Ѷ�K�ss��<�fؔ�>��8yj���3������䕶��K��G$��Y� /�z�4���K���$=_��=��O�!�A2Α�$�=_��G=��T�ÿ�d����E8s��f��Зl�N� ����}��Ҍ����'�.�u��H�τ�K�(��}:<�?�@B�ٽ}'���0��-^ޥQH�J���0���C^^�1�H�s�=IO�6��Kƍ%?KpɎ��%�����%$)#�*�I� ����#���G�x�����dy���)A� Oװ|/�$,���9��n�^��ɢ�j�A�>�2|�4X˛0��,�.�),�!��雷L$���aY�s�}X���AX����Һ�0�.�e><�\˛�*@�GA��5r#%�ˣ�t��W|�q���o�zAD���d��R�²��,�e���ȐxP������m�B���ۥ�H���� ϏB�	̛g��o��;�n�X��E�"&a�H��gaY��a���5���.���B�lr�
 ��BH��CV��%���6��v�6�"��2�u����C`3�A�AF��^���.� �]�?�h���AF+�mΖHb~� �Ѯ�d��� � ���&������u��|v� �MY���]Ϳ
���U�l�ؘ}���T�(��i�q�A6���~d:>J�?�fS��\e��A�A>���~��Y�眶�����4��g	�sڿU��v�s>[z�R����$��g�ן�ٿU�goy��5�m����_o��ax$�j�L��5U]|�ծ��.���-��w�$�'3��>�	����Ӕ��� �Zκ�ĝ�s}BH��ğ�[�|�7���v��ğ��;��d\��S�:|�H��|Gڐ�+,5��CE�<Dۜ�%�'��.�K��-���g	�I���|��?K�o�Q������ >����	k��K�Ozo�߆z��I�\{���1���QEߏ��$�R��y_��m�����_�a��|d\ɧ�:�MR���w�0�����ս��t����;G^�և��+~���w�O���O��I�x��ɽ��뀭���'9�]��O\��-�o��rZ��{�b�I}[������d/@������3)W��M�LdY��t�,���P��i�j� ���u�x���ڶO��u�`[+�8�`Ǫ�o3��bh)si��`�¹O3���8�/�.>-���l�t	��OK$�zy̶�ܢI�%hϽ��k���.�J��5��IR$�����n�>������ǒ�l�Q�'5.+=_�%=�l�$,G�x�S`�����o��}U�<�A�o��=_��G=�Uk�)u� ��]�;!����{�E��ğj��O�)��۶q�W��;��O܉�	.��b$���z�	A� �̟<���&�[�e���d��Kki��$�g�8s�;����$)�C��G]��s�S&��K�3w��<���<ō�ܟzϗ�̡w=/R���I�(���|�z┬KƏ'��yϿ�l����;eX����Q�ϟ�#����WϹ�(������|���Q��C����[�51�A��C����=o�4��nŃd���H��2|�Л��f}����.�84�7�s$���~ġG	���x�9p������yKd�?J���Z<�k���n�������*�3�x��������J�t\�3	p�KtO���%��S������ұ5�8�rUx짫]&&β\^�i)������w��Er���SYU�f�Cw�(��希c�̛�|өy?�b�v�^� g�T��a�Il�%��7x�M� ��C>J�so��Q^(�w��h���W�7ux��!�KƏg}?���%�;���$��7U���خa�H�3o�k�O��x��t	p�����ä�.�z�HK4`��p���Ϲ�8s����[��%��;��I�k�/�̝pǂ.&Ξ-���y�7������!o���F<�w8{�ΛO3B�%�Y�Q ���7�gK1���b�%�Y�Q8���Ί��Q/~)]��ْ<g��H��&Ί��Ge���pVb����G8+`X��˞H���=,��6�?L��D]��i1��6���>B�8w�<�?�����q>͒g9񳥠K��������.M?U�oI� g�Ϲ�O��K���(-,�g=r�y���"���wrA�8E�6[��K�O:������������|-��.�^oY�]2a�8T��Z�RX�����Y���9T�79��(k��9�ge�7��GMB��ġ+p�K��,N
�4�Ϛy�}��H��,w�=�~"β�H�;�6�Ń���Th�]B�-�	��HV�3��&��V�o^t	p�]�7���K��tOR.����r��l�/Y� g+�H~�ho��Đ��^�ë4[����� =�=�3ƿ�"?˂�!�[&�f�H��$Uz�L-��I�a%�'�܏:�-0N����&�@�#�빬L�i� �xS��No���ějϣx$��?K�O���|'|�e"ν�X��7���$o�7]��s����4��ܩ�k/Vň��.���%x�%�Yv�8�K�m/���
�H���V����uɄ�:��|  Q  `.��{*�%��CW�כ� ��9CY�lQ&��Th��%t�%�'��e�P�Y!�j��ĝ��K�5J�O��
��������^"� ��s~��	p>����f�չ�O�ϟ�	&ĉ3o���y���g.�ϳ�(>����;=��[ 	��;��c�'�w�����0��,>q�<�
�<��;Z������aͺ8�l��I� guCw��U��%�Y�P���� ohJ��6t���@���~���7��4�}Y�z��ܛ+���9J��]�����{SYVh�~"�&�vm�=?Th�L�����׭�A�Ϛ�0D� ���"��ڛk?^�ٶe]|�K>X�
�s&�i�����-�	�Zh��v^��o��>&��O�L$�'�\���$��7�l?H�	19�2��o�{���*@�z[n8���yg�9S%�Y�m��_	^� g���Z`����ğjϗ�ys�����h/��U1�L��y��Ѭ�v>d��A2Rܹw�Y���.;�,>�&J��P��`?fXL�y3�����������Odi��������'8w']+_	N� g�L|��W��Yc��:+Pl      �      x��|��Ʊ�g���q���U^�g�*WJ��r$G�6V�Ƿ\Xr�� �}+���� �ɗ�Tr�ݘ���_?fht�����-��㛲���>�o��7ѯ?F7#�^}�T�Ȓ�%����O���*��fk�<�/�钚%!�Ԕ�t��e��Pg����벨'<���%7K*���'� H�)[�dI��$	W��H�u�ؒ�]Zo�cy��te�|ْ���S�j)a�f��T�tl����Y���myo��>k���נ��VAd�؂H�ɐ1�K�1��Y��X�ѫ4+�O�=n2[L?��4Yr�$t!��~�^J�f��I�)%z���Y�(և���CY���Κ�,���}��:~]����b�4�zyyy�ȳ�֮�b�*w�7֮/�5,��P�<[��&�˚�R&�VBSmgZ0q�k�k�Cy=�{]�պ^l*k�my��"+/���ϗ����%gV��
���q�%�E��/�@{�TȄ�mM��mb�����vߦGX�{o�>`��h�j��t-�6�%�cɂKF� ��}�)��7����!��MZ5�>O�"+6���t��9���ǹd�dpf̂&�[��Q�B�VIy�����MZ7s�1K	G����ဵŌNҺ�UZٸ�9�� s���I�*9�b�p�1��;�������Nw���)�,Y(M���YE�Ix��]����>���}48����!e(�Iݻ�c=��q}�t]�-��3f�XJ�y��8U�u��mU�Ӻ+w�Z�����ʹ^P>r�=	<�Z8;�;�F���=��;�p�$����_mN_���W���=ͿN���n=f��	�����k��'�D��]��0�<o+O&r�Y�8��!�����S����BN��l��Ytl�,�����хe�4wv�jO�����K�����sq���Sp\�__0={o�UV��/��U�� >>��D��v�����g���=Ə�l:{�����&��[GwkcPЭmj_7`l`��c��<����p�.��|��	�+���DX��p���T���<4��}���4�cR��,��x�sv�"R,8`c��0
��Yo���'If�N0x	���*t�6�`��Md�pq���h:�}�(��e�&�1A3�3��ipD���W��s$X���7Y�m��ʸ;{��C��k�M�㵭o�O_p�[R�ew$0�d�(C}X,��A�l���s?�J)�.�n�mt*���ϝG�WT�s�1:���c0u8�^��,�t���@�A,�����a���>��}�A� c�[����7l 5�0�9��}Yll뒶iV���8+D.4�s@�v���ۙJ>% r�F�@@Tx���9�ɧ�W�X!L�?Z�=��S�ktpT`��t��I�o0b �	e���h�x��ds -.K�r���B�D�Ǒ?�~���(�����K�P����W5%3H�ב*w�J �k� ���`�(���Q�sm /�h==���%��2��0[h�xS��-��#a!��!m*��}���h]���%9�
����"��u��\� �1��q*@��f^�h�h)�h�rB� �QC���3����9 �[���C��@���:��f)ty�'��KJ�	�ɃX�GOʝEp�b��� =.�U���|���6(�c�#aQ#J/IF���s��ś��/���B%8_5g��㞗�����-+6Sf*&��j ���I}l�X��庬�b���b�<��b���V	�xQ/�^�R!o8�OE7P7jʸ-�h1�ӅW_RѣC|��fy�	�<y�X5�|���u���5i�Z"<��`��n��YZ���� d�D5��R��`'��#
%�BRɩ�o����~s�gx �\LU)�$/4z^�������2�n����詵{�Z7�W$�`�B��"z�6�NƎU	l}�	��^�0p�~�03��B�̯�p %��p��MP��U�C�dƱ�G��~�>�9NH����,����ͣǰa�oʕWxr���TB��
��>�mi�L �	ܙ�<zU�G�u6��4�R���rUs�7���;��<��z���m�+,vТ�1��z榫&��ͦ����2\�,͘�z�����;�_��<ǲ'�%��#XvҪ�z-�<Rϓw����i��k��q�ږe�H�gv���!�$��I�L���R�/�f�����U�&�^V۰ W�y�9�i�v��	-�[���ܹ�\�@R����I�sé��^�vB�=����.�v����t���'�g��x�O���������"(�5D$1qcR/.� j[#m�K[ w�0=,ȥ\IP�@�IwZ�`/�<��p�+ ��������>��qo�o|[l�bx���+���� %����:��E�J��<웝��"0�2���Bb��g�2��K�b����`h7A�m�H�IGHt�a:jU)���	�Ҿ-��K��8����c|��ŤZ՗��J��R�0=��v�wbԌ`�P`ʽP܋nR�WGW�۲)k�Q(�Oy����L�D�֘ ew�s���̄��k'@(��������/�d�Ô	ģ*�7���Q49�a�Q�A�`}`�X�p�Mθ�QDO0��i�h2���9S46� ���@�&d]��ڤr�LiF���Kk�XAWg-l�9�5�����ӺG�1+C�����b&Q;�JD�є�nZ	�u���,�M�5���>SF1J���C%�~O=�Tk7�\��0���$8�F��D
�'`�Uz�!��)�}t�)ة�L��0%�}T�+{�,�]V��u�w��/��aa�KH{�\N�á�\���jl�h�\Ǥ�+��f^�rfp�y��@8��-���>~���i�-�1��Tb�n���Q�$H��'[k��/����}�6U�߈ף�s�A��`ȧ��*��_8�J�?} �|)�d�pNR7���2�n�$��?��, ���AF�A����3�O�����E���&[YW�ۥY~�����l}����o=E޽���������3{�������'4����_�^�W��������~�=z��o�vc�v�˻��r�^Sr�w���ѺF,It�l�� iX7�,-������2�����!�ϛ�ou��.a6U�*v��� C�@@(��	��9@�����u���1����9�E )�a�A�%���&7�v*7�e���(�X
<��J���Oe�b��3��#����f�xG¤��v��i� aFx���.� �*������~$�ÍZ�H�G�nZ��f�'�����������4zWV.iؗUS��g���s		n3Vd�LRϞ���-�����
����@�GEqHs@w�{�����Sn�q�>�.��T}�ڢ�n&c��6�B o����]cA�_��tc�����(�6n ܲ\�!���%���FvWN�]ۓ�� L��_~)��Z9���϶p���ӷ1 �;�B���q����Z8G}�v��sahZ��f,��`G!(��_	�4��K�o���v�� �6]�[����Xj�'�8'�R��p�m��d�y>g,��@Q�)_�2����s���y&J�0�IW����/)��	�����9i`	8��嶣��_ol�'�ͳ��!!nTwa(��HC�M�W���Sy�%d��U"�Dk�}�g��W`q�-��x&ۚYk9tA���Z�#���G�r�YY�G5��Гv�NJu�N�[35�v�¨�J�c�L#��	�vP��i�v�kF�	aI�_��L�gg?Z��s7:�'o-,�c�2=�0%�U���m�`���ւ�1	�
!A�XIg�SAi��Y6�e\lU֫<��b���f�:���6��u�=�r��9ԉ{�$���$4�8O���f������9i��4�81�]�iH���e�����{Z�i]��J����)_�4�.@.��T�MV�qzh3nMY���&ã��v﩯,�Hn`��C0�    ��6��O�u�=jۖ�`Q[țgEZ�&0�z�; X��	�9R��'�.>�� )���*A	�ʷ^<qG8�(���\�I.)�א���4�+:�v����Ս�]6&���q��B"3q+�7O��Κ�����u֜A��uF�Y����. "@Hv�ٲh�@� ,J#+c��;�����	���]P7��c����!'$� X"������!.��e�����g��W���-{_�qX@p�;�W��g�^�*L��kPїs��p8�i�jv.b��*3+�ж~C��x��9���ټ�8���44�M��r(s3�{��
x�ܦ 3Y���/�F�9b�����$�E�x\���6�l�М��M�
rdbb[]2� �cw�b�۠�)D\��Rќ40Nܔ�7���ꐝ&=��ﱰ	�\$sֈ�@�J�I�H���,88(���A'Z@���vA�q��'� �j���!��F��L�X\�m|��m�]H�q�k��1%���EW���Fʟ�k�_�{�汆�9|D(��	�R�G�$ȼi�p2���e�MxF�[���Ǔ��I�_)�G%n0���x���q�hUe{���~\�
���ay)V�4�#d��ޖ�$!�P
�8����0��4�?Vf9��b3��oE�	i�0�9i`{�t_���Ӣ hc���0�8I���`����7��P����$�v�a���:2U]!9��U	���m�ջ4�G�����F7��/U����|��>��If*D��lK�?����Ēᅄ����@��"Q![-a)���[�����0����H&�aT�@r�=��v\f���}'�LH�-�b����u7"��&��Io�*�.Cֱ+;�4�?�<�?�߮�R�{,Ă��ƈ�úvG2d�/d�j�#��T�:�%d�-��Ϩ\(�l��%]=C��\?U�T�60�K������0�k}2�U���:A#ǫo�@� �$3#-x����7�8[�'��kс��(�2�8q��<�� M_#��	��?!@= ��(}�d[�5Z�
2�i���)q!Zi3BT�$�����1�f�kPß��|X�k�'�k�-��d]m��8� ?mu����%�t$��MNb޺�|����2j�iv��2=�^��&ܐ�:�$l�I����_a�Lr?KgB�YX�|�0'�ͩk�IkW��4����̓��?4�|�l�4Ƞ�� |a*�c�����\;ڠ�!|<���w��Э_w9?|}a��0B��<��4U������r�i�&۹jm�I��2��\}��p8��e��"N��Z���1����������"~�}v�e<p�s!�y-�6;�h���NqV�ݶ6`a
�.dr��>3Z1j鎢
4����ru@�v�eTN�{מ�����'��0ޅ�al�Msm�4�]�1A	�����ljY�7��������t�:cD�o���>G7.N�Cݝ�i��C��ӥg�)���Z��ӂ���s�-�q���F���1����i��~F��s���
]_��Y�жć��Ђ��#7ά��h�9;�٤آC�VXo�D�^��т��I�8E���/
r�&�M���:?�A�N�.�;P�V�BZ�^����NH�>&�#r�qU�&��?�n�\� �1i�H��U ����i����{Mf��#V��~�c��Y�S�z���4�t��3�i��"��
A����~��I/��m��-V�ۺbH"��"*(�U/����	�wWb��r7;�Jd�����]�7<A� ���wG70��s}k���z<-Բq����7nT>D$�Q�oy���j�dx-'v8��TP�@$!J(�:޺q�l���x����N�s9����S1>e��?]Ax�)�,h��;Η���)���Jl�WX�ܖ���(��]A/���NHk�}Ξw�w5�n�N)l7���z��B�Q#ʓMSMt3'��8��ZM�He��"p�]�1����� /�Dl�6M! ��nT�̳� i�L�+|� ,Օ� �n;e5�=���
4�<�?N���a5[N�NH�\ӵ����Vl��ն������6b��K��9��aI'��\i��(C"�����Ex�!6��%h/���J���$�S��x�A�r��^��|�ԽQ�Ett��� �igBGO�5ZY����k|�B�a���^�G[�z&�k����	@��;�����]�Ƙ�b��*.9:#�H*fpd1�1�tq����<��{N	Q�0\��̵��6Csg 
?�	BA��-��I�hI(^����s�Ͷ�Y��k��3*��+w��{�����,���8�)��]�p��G��P�/�Ǒ}�!H7�*����H�W zJo���I�P#�W?���2q��9�_�5)=J�F�^��7"�������4����R�Ae�xB�������qcq�g���&�?���w�5��
"�g�Fsw%q�x�H�-��is�yȴ�R�������6�pߊ>�Y$�T-S��������)C�vA66�Y�s��!�^4�A77Y���ă����S�����7ӆv����O�㗧+i1��:N�9�v�@�K�4��I[7�qh�q�7�g7�A�{����:�n�`��؉D@~�U�-n�4���hP�@"��}��	&�i=��>����P���.$9ӽ��>g�4^b���+ą��ٺ���{���q�[�wW�0F�d�wǯ_�t7& $��Ƨ�BqJ�C_�-n��,���MeaRp{���&�5:�웸�0_���0���ёP�D7B瀶C�������Wk��ȂO"Ԝ48o~fi87�k��L�<�8-%	.��������c_�ya��p�I�-M9��捨4b.L��@�C(}&���?�{�������q���3�_���c��hpu��Ո3��p��?F�����=a�S�g�@���
_�	kw��+�D��-W�$]:�I���8'�2ڿ�/�1S�:
`��|zX�	`n�
�o�!΃:����G[S@9j�p>?�a�۝k{��O�ol|�D�z���7�4�G�W8uٍWVƿ��:��4^��н�y(�o"󚸳%�j��W6��ȸ94�gٺ�
��i�)����ﭯe��"y���^�9> �z��޹k,��s�B+�-g�w��Ds�X�[O����g� �������^��v��h��|����7�����s�����@�	�_�9i������$��GG� ���_EÔ|��cZ���� ��_��;4zm+p"��X�Dp2�����>��2�g~�#w2O2�����n*x5�/�W�9�L�I�i�k� <R\�r�9޸��j֋mx;� ���'�@��b�F]����7�K��9���ΧL2ؤ�}��!�{��M�c����<X`6	;�6�������$p*��V#(	d��''�Kz${jS͠,q� .<1g�(p��̭]���-��F�M��+��ive��u�o���!g㆐���BU�¾l�/qW�n/��
V�ܓc�B�`Hp`���v���p�͏��f�ω�`7aL�8*���.�{�n���>� �(�L� ��e��u�<�'����>�/�'��,9ev�;ܩ��/NO�;�	�g�C˄����u?p�Ο;%J��A |�{�����ˊ�',�B��j��5XL\Uٵ�\�sqHk(`��w�
����V�O�1�	�:��-�ߧ%��YP-@���Xw��Hg�!��t&��u5B5{Y�3te�
s7Җ|`H�*���k8Z��,;��Yb��9�S�����/BqW�l��Sֳ1ߌ�?O�tw��P�t7�Fo��|M��B��h/���ؚ;U�}�n!��r���if��J�bU⫍�8�˪�>�-�4/��ۗ�w�����?�{S^�[]g����;� �c�=��6�]^w��i�O�)ׄ�4�d��\�6��o��*�&�k��5!dM�6��sP�5Bq�|�^�h/� 9�c#w��q�iG�����J�U'?!���   F�n����k�3ٖ�CǤ��"�θ����*�g�'�=�'kez�-'���!:]ʡ$~������E�ע�����E��e_���V��7m�`�i�NE��t'�u�@�}�7N�c�����b[��q��b\uq��ݳ��?�ۓ>�-�Iwc&]$�ޡ����:Nw3u���k�03uMI���G]�e�ӵ:�W�g�: 1d�y+�_A�}j�A���ݣ�ǐ��0WJ�r
��.���h�ҩ�sgh!?�D�e3�� �]|����2k*      �   �  x���ۍ�0E��*��|����
�{*����%�v$�>���.�`���+�����_>�{���;smǅ_J��:��z�~\� �m:w��t�a҄o�2.�est��)[��+�ߕc+�����F��)I~���Rb(�>Q2��+�'�R��|��F��X5�Q����+wlU��Fq��"��7z�� ����<8��hx"�8�������}�\�� :W
�F���>�{�V�9�*Z O|6J�����B�U5lO��"�
>�z^�5|ґ
g���k���𔭭Z����q+�c�N�rw@���0&]�nn�MGg�.�;����yM>�6�G��Va]�9�Ӄ�e��팤v��k���lxI�;�>}�(X�#��0B`t�.=^�V��JN>�=�\��3
@N�r��v�xMS~��,�t�
誏͔멙氇�~L�R�}�SgK��3�#ư��x�Ӕ���4>��a��rRP�Wy�޼�ϣ��C(E��×�X@(���\�_Fe
��m5΄�]����Փ�Dyĕ�\�S�l����!/�J���=oam����*ކ�qBA?G\�!O�9����%r�O�A���k�!�a��'jU����HZa�;h�\5��!0���"�qy���=�b��O������^.��A��      �   +  x�}�ّ�E�V��  �2�Y0���.�L%��ɘ��>E� 6�_���U_���%A�7�_�?�o�W��7�H$/1B[	|s�C�T�J�%җ�Ê�[۝�*UV�,Q|EG���r�tq�;b�(�bgĉ�~�o�r��mfl�WL��/N���I� W+�2f��+g�u��b��Ҷ�Y����ua`�Uoiط��H�^�9c:Y��7����9��]"i
�p��[��X�A"jr'�!1��ƺCF�X^��T� ��K�a%�D���*�C����+%�%w4�H�%]IN�A"xWrO3B�,���u`^!�D�Ҕ}%y]	,��9r;@�হ����7����+�acO�Os������L~K�_��L�U!�i���0�#��psA��J�ױI7�~�b� �a�-�Ś&�&�4��e� zr��x�'��ٯ_��i�j)� ܴ���� A�+�z��M�p
H�_�{2J-~� ��t� � ܴ��$�!l�56v�nZ��%=@���\{2J-~�R<@��2ޜ�D������Ard�b�;d��^�c�汸�|�v�Af��_�=6m�m�"W	������{l�<�[b�A>���A6���W�v:�D��u�ͫ��Y�U\��t����W�5�x�x�1$R��?Q^=�YA���H�8_w�<y,{d�zi��x�Hq��l9�\���r�!�D��ug�i����~�rX�(Q�����|�x5�B;@�"�ם-�#�2����Z���_9ZV��2�r��DQ_�{�䯜,O�c�+�y[7�Pw6���fY!Ωk��'�:erXa[4
^�i��]"���Z�is|�y��	=B��:��D�{�|J\((1с�-kKe����PIJ�Q�׵,%kN�	�#U���H�ԇV�)e� h+4����H�����A�G

�3�ɏ�ǃ28n�ڌ͔Q����D�~�;b�(��a�'��y��K�#%!���Z���8��VY)(��Vtz�Rf�� ��q��)8�1��$Bd�}u)�~b�o{ړDH���5�'�w`�O��K��+v��Н��/uE��/ߵ%Bdv��_���F+��':J�,��^Wہ�6�!2�׵0Q����R'י�I�<��^��LAy4܀�DH���uM1��|Z� 2!�{]ӕ�S��j|�L
!��ϵxf�ir�����s�DI?��{<D��DH�,/[�)>���в%B6dq�me���K�[���!��綺Ppj��tY(�DH�,�l~Úw�(�!K��u9��jmW�==�."K��>`���(_��Y��'�A��'�RF��YC�L�˞ �o"O;�K����3�/j.؊�� q�l!%��)^Ȟ'���r/�-%#��9I����'y�z�یQc�Ҏ�G"��Ʋ���Xm�
�:p��Y�s�s�fm^v�<!5���NK~%X�Ш�F�.r#k�c�\px��8mhP#��DH��ݏ�ag�-"�����$Bvd���;[�㘮ێ%Bn��=�y��*W�eǌ!�r��=g[�d���G"�Y�����j�W�d��也H�D˱{��� �q�X����V�,Q��x�O�|l3����bf��o9v|�l�[p�<���{&�i���9�Dȶ��
�������ꨜe��!��{.�ӑ�[h���V�K�����0O[��po���0�f��ٻ��1��6Z@�b�����s�=~B�l��1�DH��J���~��Ղ��Y"d]���q���sBo��8o�&��]��Ǫ���)Y)広F�,�r�����jgR2@�D�}�ϋ����~���V4Hd����XP6	
���o%A�D���ύ5��f��P>-諐e_�c���l[m�]��H䩼O�E�m5N�9_�]"��ܧ����v����N�I�5A�­&N��XlRUe�����hxu}?NL�'&~�,B�`Ӄ�yq�G���2q���(sF�%�ʂ{;/�̢e�.6@���A"/S�8X���n�v0g�#��)�g��|(�kk��);h�Ț`K��f�u�m"��'� ������T&q���hy�=Jd����Dlv\7[�w��$���`V���͖�ӹZ�A"���gyQҶ�v.�g�#�UP����&i�l�P>m�(��PܺC>�IFc{i}�iA�D�s�J�;'z�	����D�s��JjV�@l�b�N�s���c�C_Iu����-,���$��[��Ԏ�d"9�D�"s�N��ʑ�_'\5n�%�&����2��hW񯥺rf��MF��9�r����M��rf��O�>����X<Fw$r�:s6��U�>��h�]��8�D�+K�KN#G�=�q.�NY�,}<.9���qL����D�UJ�K.+A��IB��+g��=wuΓ?���](���&�&�u�҇�ہ-��r������%,�w�dlB]8�D�-K�K�cN�W
y��g��e�g��;��o���s���e�cn)�s�ۛTx�Y�,}�-%9ц���y$��Y���G�9��Q�zX�(���҇�R�±��κ�Y!똭[qJ9Rڭ���G"똥ͥ�3W������f5�Ty���Ș|�|��D�zK��J��G|�+��\��&�&���������}�R]8�N��9�V�����(tx~�M�z�Q���/���ږr@�[)~�Z7����� �ޯ8(�Z�O�4�%���	�"�h��w��T���$}A'�lD!}ƪ!��:�o$�K��>IdC
�SVe��hm�Se�&�y��D6��>�T\Ze�Z'�z'K�'[�1�������G���e%��`�D6��>�U\7�6Y��^��Hd�
�_��j���<�!T�svHt���9�h� jކ9{$�=��O�/������h��s��w�2YW���K^A�D6��>oU��֖���ۺ�EH�9t�H�{�J�S�v�-��$��7��i�-([��[�h� J�e:{�������.��وI��U��m�+vK�� �������~�[G4����G"1I�">᧓u��e3�&+h��FL�G���iL�5���ΠG"1I��Y�?�����_RI��L��KdC&��;k��c��3>p�l�$��gM�j�u�1� Tl�`��p� �%����W� �ނ;;��G&��*S��`�w�ABKy2�(-G��3K e���N�ہ�gaB�2l�M����w�j/��k]�{�h/ǃ�+�$�!��鲢��,���o�'� ������D�N��-FY9�B�mx��p&-��*�B;���$���$�a����z�g=ɾZ�O^���I��."�?9�U      �   �  x����n�6���S�T�@X�%�{�n���M�n\,
셖&17)P���5�z}���ػ@/��@2m�f�1�?"�Qk�>��'W���h6�gq����y�&]�g�"γ�|��ߞ�lm�yA��������G��@�7-*T�U�T@B��F�����h�#CPKv�`d���.r�8` �?���P%���BX��G��*���#�c�TՁ��iZ�����l9Z�{����5�`�=��P�1Sv-���/TA����k������[#���@2�EKv�h[ɇ���	]9N-́��Z��Јm�XIʌ��
��VVT}'�V���<6^�;kdaI�)��DkeAJ�TE�9��RvS���� ���҅�R�^b�S�B(�^j�����S��� Z	�7�P�{�KKv��j���sA�{�릳���1#�PQ�"�G�#��_kc��1N�5U;&	�P*��V�[�ĥ�yK:e�~��L�2��R�`Z��w�3@[��Խ5���+v-�J�^e|4�R�Q����0�	�.T:CD�Bނ}��$e�� 13�L�m��K�\z&!cH+��#�.zD�!2bv�rHČQ���R���9�CS�7J`�fc�R+�Y.����d�+]�H"C��[G&��vF%��bT)��#ZO�$IZ�J��Q����6Q�'q����D�$���*5n�Qq'���z��](�Q;�뇀�j9499e?������
F��R$�<��0���Y��	]�.1�]S�	�F؆��k��H�1�쀐��+U6n�`���ܾ�+~!>�������0ztT��Q����@��Dm�}#$���KZ+N��N��,�
����:�GO��NF��4%�c uj�@8�B4u)
54c�Zj�K�JE�� �u��b�$�Fs�&a;C�ŕ�����R��|ƏJy�Em����Ӫ��#�PDbcN�O�����4� o�׼�X��̦Ѝ��J���0RWEk��5��Z5�u�~/�*��Б����Bɦs������h���JwOЃ�l�o�3,l.��+�~�&��즫�`Q��p�������v�~�
5��O�[��c�����?��³���S��W��].Ac �{\�k���P���ԉ[�T�wb/����D-�Ɨ�-.��qjct����(��t-��m���w�8�D�{�97hN=K���9������۲�*�w�}�Tn�CU�&7�׾bO�,Qz��o,�F��)�e�xD��q���L��Rw�Y>3���6T̜�պ�(�K�����rG���]���	��;��q�.a���q[�p����D�c-�EU͆��`Z:]�FeӅ�`T~|)5��i<v��7;�r٪����PX�yǅ:؝B����|m�^P~��C*L�Z�%Н�wWCk��
������0AhHX1�&�1N�qɴ�	F�g/�$��}�4U�^n����i�)�r\�� ~>?;;�ڑ�      �      x������ � �      �      x�M�[�k�
E��*�i
��˭9N�É���왐ed(�n���=�_�H��G�?���hA��ŏ4��������y}�>z����z�#q�#q�3�뇫�;��ibY�i�X;ima��������NZ[X;ima�������6�NZ�X;im�����v0�� ��`Z�Lk{�imo0�������v:���zZ;X�i�`��������zZ;X�i�`�������fk}'b��߰f��7�Y��k��Ú�hX��k6������70���n`�`�L�}�i�/0w�a�c�Қa�Қa�Қa�Қa�Ӛa�Ӛa�Ӛa�Ӛa�Ӛa�Ӛa�Ӛc�Ӛc�Ӛc�Ӛc-Қc-Қc-Қc-Қc-Қc-Қc-�Z`-�Z`-�Z`-�_���Xi-�6�Z`m����Hk����k#����6�6���j1�&��z1��`��kH���Lkk3�M�ʹ6�6����Lkk+�M�-�	k+�M���6������Jkk+�-����������Jkk;�-������F��"fk)b���"fk)b���"fk)b���"fk)b���"fk)b��v�^�����Z��m�����Z�������Z������"f�%?Lk�%?Lk�%?Lk�%?D�7��RK~���%?\�܉�D����F��'b-E��Rļa-E�ђ�Z�h�J-q�d��8Z�RK-Y�%����GKVj��%+��ђ�Z�h�J-q�d��8Z�RK-Y�%����GKVj��%+��ђ�Z�h�J-q�d��8Z�RK��%�q������$����$�����?-IL?-IL?-IL?-IL?-I�?ȱ�r厵�+��\y`-��k)WXK���Zʕ�R�<��r偵�+��\y`-���R�|`-���R�|`-���R�|`-���R�|`-���R�|`-��'�R�|b-��'�R�|b-��'�R�|b-��'�R�|b-��'�R�|b-���R�|a-���R�|a-���R�|a-���R�|��}x�y��m������|�60��v0��0��`~�=���;��T�Lk��i�40����c`Z;��`Z;Lkg�i�`%8XC	�R	�a-� �R	�a-� �R	�a-� �R	�a-� �R	�a-� �R	�c-� :�R	�c-� :��M�c-�4:��M�c-�4:��M�c-�4:��Mð�n��t�0����a-�4k�aXK7�Z�i��M-9馁��t�@KN�i�%'�4В�nh�I7�䤛Zr�M-9馁��t�@KN�i�%'�4В�nh�I7�䤛Zr�M-9馁��t�@KN�i�%'�4В�nh�I7�䤛Zr�M-9馁��t�@KN�i�%'�4В�nh�I7�䤛Zr�M-9馁��t�@KN�*-9�����"В���@KN�*-9�����"В���@KN�*-9�����"В���@KN�*-9�����"В�Zh�I-	�䤖ZrRK-9�%���Ԓ@KNjI�%'�$В�Zh�I-�Ԓ�RK"��i-��i-��i-��i-��i-��i-��i-��i-��i�`-�$�RK�`-�d4������.>�9:B69±ޫ9���@��_�ƞ�G[������������fR"$ub�����.0i�/�^�I
����`S}$y�Kƶ~�>��%i7��.;�$��n�s�jI7>��������%�^������18����r:�2>b�=�+�%~�巟�����I����
)���K������:a_�����^k�w\Z�,�f������P�G
悑�>9��<o����,��������dv$I�q������vml�v� ��|�p���1����Mq)��������v��\�{d�{ ������0�������/ݸ�ѽ3�7�w��F�z�ot?ߧx�>9���������p�������|G4�wIɜ� �5�"���-��X�Z�p.B%���f�"����UA8�.d�n���[���Yh��{����fJQ^� ��Qh���7�^m�!�FL9���^���z F=����}X��m����i�jo���w��)�Qh�p<t�/^�����������|��zu�<���c�U�y�7k��~��'lv�z���:�U�Ga/k����FZ�d�@'��0F���Sh�m������.ĵ�&.�87~Oc�l
{a�B?�����{��'4e`@�p�;��
7�	�A�H�c�y���f�m����ڇ�}��V�Y�H��Z�^�0�{�������{���	��͎�b+�H=I�A�M�c��{��{�����5Qh�3��ͪJ�l����~z��g�}Bok(��>�D!Jٍ���~_�=��h��O��������Oh�8w (����j+��I14J�
#
}?�B{o������X/���&r��
7��ρ\��n���Ww����{��Oh�BV���}Y�Mx)$�q�߳&�:
}?�B{�Z+��m��E�>�D�B�1Y|H�I�
}F�W����콭�g�r�`�p�I)=�W���0����=��^�����)�7!	��
��b�H8#
#7?�
���G(y�qSR���>nʤ����N�i��@�b�h��5�}+t�$�
 9���B�w��dr���c�M2���M:����|{��H eE�Ly�s��<��Q�3�w̴uؐGR[�ey|�u�a|��a��+��{0�2E�u��9]��Dog]��}s�q2,��z�__��I ��� ���w|����CV�7l��}~��o6� M�)0�g�� �I_ib2
�����͑�����y`x!�	p���$�D���|��ͧ��A�Ӎ�A�p+{ d4�p�ƄL"��3{�q�����~V�Sι�'~a����9:;�O�`��Ń�1�yd�u��i֦�;���	��ՙ��a��f/��8��|��{�b�N͜OPl��A�W��6��u�^��9͐�n|C�+����f�:_�}B��X�;ߌ	��0V�·�t>����fhQ��~��z���E��yP��h0�Y^��F��!����|}�&����}>ǘ-��]�����+)Η���&�~������|�y������K����0��sͮ�d�,��s2�oY��GC`�C&�-�y���dbߔ���������(��l/PfO2�J�fW�'���~D� G:Z5�תa�[*��|��{��\�|?��@���k��U2pS},��[l~o{��.�Q�Jn��c�����#*���U ��� ��J%��M�!�d@��,b�%oSz<_������w����\bO���~2��h��w���Sh\_u���ǇJ��"��@2�Z����|��������|�?�����3$�~͏l_��w�\�<�H�
���ڡ�̛�
(:�O��v�~�	T���ŗt&�.=�_�ֵ\�)�����J\��K�_u�t��𜗑��<��������o�fo��j����]s�[hO��|Ւ:F-��;�k�@���-���I�T&�q~0{ͯZf�/g�[�+��*�`eS	�cBiU{[4�pV+��D-���~S�+xڔh��+��MiJ��6�-Zl���=/u���w�H�6?]M���&,�2g*�aS�e��n������ys��O�s�̭�h?�SC�z�v0ߖ����:)��Lp%p'N�$bm����Nk�����vZX�im`m�������vZX�im`m�������NZX;imb����5�db�������&�NZ�X;imb���<5�L�g������r�e������2~�0�eF�2��a�i-O-7y?�`Z[X�ima�������6�zZ�X�imc�������6�zZ�X�imc����5Kkk��6�,��YZ;X��v�fi�`��������5Kkk���8�''�B��A��J��I�%@����v�sG	P�
�� ������\�R����W��Q)��;�Ł{.���pQ�l�N.��)>��p{m��9ϒob!Z^���
�J2�]FF�8��8��:�E.���/ͫE��o�^-R-��i�)U�}[׮��\߲���gn� P j#P�1�L(�    	u�P�zؘP�_�1��eBQ��43�73�*E�4ji��H�ŋ�fF�
�y3c��j�wY	�%z͌�kfP�����M�k�_�M�8/�0+���6�bL(6^� ���t�f�}Պ����_u�V�$����v���8	��ԬUj�+���H����R��6'�Α�<+�w�>�w^�o����Ι�i�*���%�0䙲Ħp��~/߷Y�pD�>/7���U�������_�F�C�'��Q[v�k�����M�~a�j>k>��l����l�؇�Ce���CT
�X���AV�_xy�ʃ��/������ު�e߻��Cڷ�y|�/�U���{}[W�@�����]5�ۇ(�@%���Fm~�����H�-�Iw��.�tK>ҕ�4	���HRU�o!^%Do�lP��q�Kidl�D�B���v	Yl�Ĉ�N��s�Ä����<��|�	�C��4J�eB���d��ƞ$���t��S�R�r $di��������
�*�+ꘞ�	!�Ba�o$�å�qǇ�&	n��p��E����/jt���[=�Y��PIH፰SH}$i	!1��c��� �/$e|�R
���\���̭*�׫K��\W���i?�m���H�q5��6`���P*P�S�d�����R�#D©kԵ\�@Bc��r�޿��߇ͯ@��"!Y�[���rn ��E��)�R�4©j\��B���֋�*��T��vrJq�"8���8K�U��Ӟ0Q85f U� In!ig!;!�F�Pe�Mr, �}��[L��\���LpU�©?�	N�&H�ZHᎰ3iU�<�g��C���I�$sR�ǜd"�<�N�R2'�
�s�����LD�Z�Bv�B��B�m*�ܔ��싄����
V�(�;�rM�ń�c�l���v�ʳ3Ϩ��OHA85:L9�t�lAӆ�ه�RS�[���0��T0�T�N��v��S�
�f	�b�T���P�ѥڕ�?!���I!���*��*�bz�B��BBa�^�驡f"2�@��B��T�	�T�nG���ݣ��5!�%!�mBgPAcPA#UӢ(�BH��0P.�N��Q����>
9������]�����B6!�(!��@�@g� -�����N���¥
a<v�Fk�z�ʛ���H���QԿ�=SY�U;��s�J����h�B2�B���N,F=��+Mn]�lr4v�_(��_��Qx�J��5}.&��\�^�Q�z������(\��N�5긴��V����yjSF!��^���_e�N��Nl��vW���ǧvL{*��ݕע�uV��հZ����� f?!h���)�S+ �iB�ń��
��t� �R8a�w�ŀ�2!���7�܏��OЇ������j�h_S�G�I8y��0³h�S<D[��HhpQ�>}s�G�M�����
 n$�.=u�л�P+:�}j���O-24��J�������J���� ҁ�t ұ��%�!�mݩƥ�ǩ���BH��S*Kׅ�v҂49��4kR�ޔ�#�~�!��N�%M �M��t�\�ɑ�D�H�T�:�tD9�p4�)�t*��S�9'�j��(K�X A�S�^-�(�RL��ŋ�5~�ԓ9G5�#q2i���sax!����#5�j�$� �J]�Y���N���Au鑴�[�~�:/$R�}n
�յɮB^H�"D���$/����]��F�Ѽ�0JH忐fp��j-e�!+�OH0(T;#yY��S�`H�&G����^Uo$�L���^Yхt9���NBBP}B�Fʹl0�4J	V��rB5p�]F�ԙK�P����Z@9 C���;� }j��C�nE賐�G����Ms�:�' �.�YH�$d�/T#+IQ$�"���2�1!1�Т�3�I���%$�S��`�����j���5h���F���<���u��� ����|حB{*}n��`V�V��T6�
SYM�"w.��������A��}�B

n<�2�x�U��Y��bt.�N	��+��Q
^	��F���w�WG+t�K�s)_�*�Jq���������뭺����>�����gjt�f=@���Zu�1Kn��
WT<?5P�Q�� �$	�+%I�{�Ne;�F��U_b_��Y���x��nh*�Ǐ��&GQ>�PE����)����x��[nhϐ�cT�O���O�\�U���3��
�>�������2'�2'{E�\1sC{���Q�x���8�9�*r߳py��T��J�0=�:az�������=;G�b��[����	3uU�g���2#L�]i ר�kԙ����u
�2#�F�LC͜���Qx����J��������_C�Lm�s����>�NFe�*#`����x����㼊�w���U���*�o�s�č����pQQ>YE��"wnK��=���?�b�ꄝ$��l��:n���J�Nh��1�`g��Q�G�R��I�$	�Vm�LZ5�Vi&-.M���K�����1i՞��*�B��w���v�Ԙ1SW��J�0S�P�.�'=�kN�3��$>@SB�I�L�!�3!��BӠ2'q^BZb!�sB��7^;A��b�jݪq*��.!��ܠ�+T�^�2�7��
=���D���@��4N�s��#!׻9���[(�LH��nX�p*�gi��@Ӑ0w�0�)���ZJ�P���Y���&8��]P����"�_��_h5��)��
�o�_D/�0)_��T^�p*7�W�r�� ���L�=
���i�� [����&�A�g��=
�_�z��i��/\b�Hl�Z�EM�~NI�1cW��"��Y�� .��Π�%�jvW�������r6�_�vz�?�Q�R�2�|B�����&�oc���^��5׹GO8���(/�^.BW���?���K�Ό��3�V��{��%�f)��4��h��)=ƌbqEǎ¥1ci��F��!�j0��)���kNIBʊ+hT����KR�ܑT0wtysG��2�\JB�p�6��ի���q(�UL7��d%��TH1�0�7��J!mpB�8us
�EB.������";s�����F�B�\0'h�H����|]�B��pi̘��Hc���C!�dB�um�Z�S�Ǥ%9�_.�#NHϗ�Q�\>毆����gX�<�!m���f�B
؄��Ҡ$�0L�Pe&��K85|Le���R!-��P�:t��*�H���?T���b���R�$�mO7�P�%��rH'6�C��tR�m�5B�?�+���>�/W�1sA�.��D]��j�U�}1�mQ7
��Lx�l(�.Vӗ$e�/�߆q�#�k�<�*#]؆>p$e�A.S7 q7�dAR��&]�DI`�~T�;�R�*��']hCnPGP$�t7�F�w:	"�+��lJ��JS��Q�~�ҭ;:0@̹�J���RQ		+�0��W�͇$�J7H!�b*�z��/�ϧ[���9�	��ӍBB���R'���ۇ�^-׆�Ԇ��۵t�U8��^�O�Z|L�;�9j��Q�z�"��ݵe���ڽ�����n�ұV��"��Y->�j�1md��k����d�z�a���޻��z�� ��C8�K�v-(t
�.���Ւ��$�Յ�k����.>���l�3kI��^أV*l��kA���.3��!�d��H2���V�t.��j�V�I'�E�"�Nӊ�jA3�F��!�:ϊ�uoٵ��U85f�8V����eF�<;��Ud{�j����L�Q�k�gVk��5��`*�¡1c*�zյ�3���3��[4�����m��ӳv�Vk�`H\g��tС{WD7T��2�˃�hie�����'�\�D��e���^��.��5�,�Z$Pݳ�Z�zAM�	]\�ʠ��ti'��"A{�V݂��|�k��	X+�.�c9Еz��h���{\���XTD����>��i�:�B=u�&�����U�KH�,$�$��UrA�ֹ��~戄]�T��Ē��D���q���洄�`����T����BR��BG�4�^YH� $�R\#$(�wu�5i;�\��ޫ��uk*�h�И#j�KH�  g  $�$$�&$-n%�rn�
���� ь���tqd��@]D�95� ���[H�A�t�0髐�o]p��
����]p��ӽ�
���X\�x���}���($��\�s���Pq9sr��
��ܤ����^H�Pw]i�`�RJUE�H��M$��UE �*�@@e�*�M$��CH��*���b=VU+��?Hpw��"8M�d*��F@�>H��P�Z	<K�تV�[�U �A�Z�8�U��*�X�CJ�n�w8�VBߗ��%�jE���
$8BUU��q�#uH�����]UE�o��@@�z�a�
$�
Hp��	�$�xk%8�V� �$o�5*��"�Q�B�+���Zh���s�[+ѪV�5@E�B��Z�WA�_;~H3�b��jC��^|TG�l�*$�B�W �@��j���
VoE�

"�B�W �*(^]Eu����	
�T
1_�D�	{��޲�VeA*����MX��W�4�����I��UE����WL�_1��VلW��|U�"([�+����J�B�3UE�W ᯂ�W�&&S��lU+�Q�Т�&ƫ�{e����b
�ӭ�	/$�S)�xa����U������ �+�*"�M��+��e�*�𪕘�*"��^%��F������yR����u�s�ਁ��,�՞��^�a/�Vh�m����ۨ��vz�(��h�T�i?94�@/����(��6{o��ܬd�pkw�և�	r"&��\�W���hw�p%:H���ro!�®�� �؅T)j3M~]��*��8�����QT�(�B
�����\��������{g�B]���ڢ%_h�l%n��/P���{�P�`/:8/:X/$x�����[E�B���������F/f����y�?7}�!i������;S�7��xS.ޔ�"���7S{{q����r��D|3�����HAs��D<o"��Gq��4S�����E{�ы�����@(J�
��E>�
=^��&N�oh�
U{�(�A�^h�b��b'�G����^��o��b�vV�W��ǋ�^�F/v�/v�ӸQR���br�x��;q�~�	��^Ӌ�z����7�ݿ{����&�w^<��r��}��F����f����?m��O7|�E��h��j��M�0݉��w�7u�3�E���o~��t??��2���S��r�Ϙ!�z�¤+�����xS��`��g���X��,���hF��J3�D�.R׸���nEk<�@_��m$�Cn��g�mw��kw�߽y�ѧ�yݶh�͖��u.u]�ĥ��6C�wH�Z�i|��5CkD�R<�W`����������9      �   B   x�˻�@���	��������d�QA�~hPZ���-ւ7s#j�9)�j����,d�H~��a      �   <  x�%�ɵ%!C׏`��	p.?�8�W���KB���'b"1�5�&,~�@�,I��3�ӊ��E�H�����d�wM���I�r�d3�Ȼ��sŕ��q��o�1��%����(�
G 0�����6�A )?�,uK�B*�(��Npk)n���C��S�vr��p�
��S�*$�����=�r�ʡ�����1hځva\ƅqa\��� �p�p��?J~��$��L�������5]i��,JCkh��5�[hBFm[{��d[��P������m�	��v�[�oM�o�L\WK��o��Si�      �      x������ � �      �      x������ � �      �   �   x�-��!�3SL���K��#���qU��
0�7���8p�������R�ؒ�#�����R�8��C��^�va�Z����^��U��aU��XG�dsנ�,�p�.v��������r�	���yk6�dti���:D��[����Ǉv�:p�L�̺�����*vG��c�qw�>�ws�"VaC�׻�dw���*�;������L(      �      x�3�4����� �%      �   �   x�=���0D�5.&�l�K��#�as	[?2�Ub�k�HQ���l+��vg��IQ�ҵ��ek��e`b�s�{��̉�\��:ѐ�[CMak�̹�>L&�ZT��M,TuRe�6�^^tn:����M����5��v�J��»G�zh~�IRM��/�2�\TK� �M�*�ܤ���M�)�D�<ȃ<�uo>m|?c�XN_      �   !   x�3��4�21�4�21�4�21�4����� .We      �   a   x���A�&�Up�L�q,#�*d�� ���]t�z�6�ճ`�=X�;q�)����Ŭ��t�#�'8���%�Tf�A1�@C,|? �t�      �      x������ � �      �   G   x�%���0C�s=���.�?�py�%���	�G����5�v{��eUV���?u��T���sHz�%      �   �   x�5�ɍ0��ʜƹL�q,�0W��B���ۯ����t'�b$�,����9=�B��ͷ:8�9}C;�L�5��lA����P@�an�NޛE�(�0{��k��&��wYR{�\��Z���Y�Z׶�u�{^��j<)��1�?I�1�      �   8  x��XmR[;���"����n1+�*�>� �����ϑm�B�c�(�^��:���*Ɋ��J��8�骉�Q������G�)� ]&Q��b�>��;s��h�d�����Om��M��Cp�]�d��o�n,��{z�s�ųߖ޷����q��>���p�g{�ow�q������χO���'�U�kwl�W��e#�ڱZ�H��BO]���z(Xp�Ѽ�V�lHê�ϳ1��������Z9�]H_)��|Kz#�BH\�@�$1lw�T���o�r�����w���ߖ��=�wc{,�n\������g��I�fv�:�B�fm����Zg+eSr*<D�v�ex��m�!a4O���M,�0��8���ۺ��"�/psʒ�m����P��a<�'���L�O����8Q�D���T��P����<��w˄ϗ쁻�V��>*�XQ�\��dI�u��
�^>�%9�xUE�L����ѷ��xصs�>+�����R�O�Y��X�tCq#O�o6��6K�u4�Rga�u��F�,M��+��b�-�>�ġ�N��"a��q/%�b�eҎ��?鵬*�^�X��u8���ɻ�(���˘!��6��@���3Ũhˀ���f��zNi��:��rU����.�@c�W�[�[��>E~�	�	H�����}܍#��f;M��Uz�Xoh�x�y��e�4X1HA���]m$)u�O٠R�����mL�"��� 3{2�	@cl	71���*	�7��ƀ����}�}s��u�xᒧc9O����f<���o[�Nz�:�z��k�0#͕B��dn`�i+	�V�qo�B�f��[��R�g���h��V1}`QY���M���$R�y:���+XO�]x�e������K*��i(�^�Sk��ݨ�;F�ō�����|�������ƒ� ��h)�(j":�h����1j��}�9&tG�x���
4yҐ/]}��?��=��guh���[�#�-PB*�l�uH����ʆ��IjԽ*��*eF7w\C$1�6]]wQf��7 ��D�$�%���h���@'����?��s������Sa����w�����3JJ	�3�)`�9�Qi�xRp5e�z�:�>6|��d	
�!����X�ܛ�ę��S�B+ylf.�d��/V�,�������5��7���Vn1��	ӂ=�&#�'���X
�����o��+:�}�eL��\ƣqy���UQ�(}l_��+�vA�~۾��o/�^��0����0ޗ��W�/������OQ�kyi1&��k\�͕����s��c�U��\RdƁj�0�h��� �}���Y�T$eÏ����m-��_�ө_O��|���?�K<�_��>5�t�ܚ��t�=|�0�=�M�P���aC -��	��4s�Y�qB)m���
��-c\���D�m���l1��v�߃C/��[�L9]<}I`<\eP)��n`N��R,���Y�0��q�Q��)RL��#�&-���$�;P��|�����\���x��F�/�s��D~}�L���ǡ�׾��ym���%
��
����8A:��Ȑ�818\e���E��eYz�E���(`��a����"
���S&��۩��`pA.۹��y�^}���}Z�k�i8��q�A�{�L��r�@���!ZI�y�J�k��o��j��{PM�pT&A6�ú³�+-Яķk�&�t5U!�����W�(�{8W�=�K�I7j��F�]EG�F��RhZB<U�A�i��+�2�(bO�FDVI$���C�6� >�E8!/��H	v���;����(��Z'��ė)����E�un�A��5@0���A�rdH�ƾ���6'� 9	F�9А�MC���&�{P��&�뢦/��ɶ?� �����#{���~<�t=��v+���kňO3gw��0��6�gH�� p�>�I��Zq���sX�fC\GP��@9��0���K9�"e���}�x��F1���^EL���s�.�Z�����t���g�-�p%K�cGhٕ�	�K#�Ð  Bc�n��<'�-�ԧ���T��c���Vjt�����sj�iu��+�+�-��=q��V\��:��������>]=��=������h�̲�SĲ���a�D�=��c���9e I�"4�c��Z�����{pMy�ΰǌ֑u �
��%���n����ʖ>z�ǧ����}�%?��_*`�gE�(�0�ᶨ�9MC\!�WNUe�#e��)E$��=�R2)� �ZS��-��P[�&�y���1$'蒣��߉jN�,����w}��`w>،������۰�^b? �u6�b��N�l�_��Z��}��+�x.F����t1�m�J5c�1=�MVKx��F��Y��<-y����WL�����f	�fi���o���1^�n�l�[�?a�'K�f:d�����d�L������'A.���G�k�="cbS�+R�#+k�*�9f*-� B��?^(>�A-
���3 (H� �4�����i ����l+lt��M�$��K��Z�\�1A/�*�OH�t�6�ѹ��F�-�uJ��3�ۉ�ř!-��b��s�g�}a��ğ�4d���l�a��
�p�nM�3,�e��)`p����[ńG�`:Ue�Dn<�F�Ґ����
��N�>](����KuE�t���fɣ�<�����a�v�H~ٸpך!3�obqƼ��@���H�����e����|s:-���%Ԟ�'.糴u\�Xv�wȮ����R��|���L%b�     