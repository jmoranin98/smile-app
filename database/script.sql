CREATE TABLE IF NOT EXISTS "users" (
    "id" serial not null primary key,
    "documentNumber" varchar(12) not null,
    "firstName" varchar(50) not null,
    "lastName" varchar(50) not null,
    "address" varchar(250) not null,
    "email" varchar(250) not null,
    "username" varchar(50) not null,
    "password" varchar(300) not null,
    "role" varchar(50) not null,
    "age" int not null 
);

CREATE TABLE IF NOT EXISTS "appointments" (
    "id" serial not null primary key,
    "startDate" date not null,
    "endDate" date not null,
    "clientId" int not null,
    "doctorId" int not null,
    "status" varchar(50) not null,
    "observation" text,
    constraint "fk_client" foreign key("clientId")
    references "users"("id"),
    constraint "fk_doctor" foreign key("doctorId")
    references "users"("id")
);

CREATE TABLE IF NOT EXISTS "notifications" (
    "id" serial not null primary key,
    "title" varchar(50) not null,
    "message" text not null,
    "userId" int not null,
    "seems" boolean not null,
    "createdAt" date not null,
    constraint "fk_user" foreign key("userId")
    references "users"("id")
);

CREATE TABLE IF NOT EXISTS "materials" (
    "id" serial not null primary key,
    "appointmentId" int not null,
    "productId" int not null,
    "quantity" int not null,
    "totalPrice" float,
    "unityPrice" float,
    constraint "fk_appointment" foreign key("appointmentId")
    references "appointments"("id")
);