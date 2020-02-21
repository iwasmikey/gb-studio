#ifndef DATA_H
#define DATA_H

#include <gbdkjs.h>
#include <gb/gb.h>
#include "Math.h"
#include "BankData.h"

typedef enum
{
    SCENE = 1
} STAGE_TYPE;

typedef struct _TRIGGER
{
    Pos pos;
    UBYTE w;
    UBYTE h;
    UWORD script_ptr;
    BankPtr events_ptr;
} TRIGGER;

#endif