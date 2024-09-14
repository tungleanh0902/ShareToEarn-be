export const errorHandler = (err: any, req: any, res: any, next: any) => {
    // return the standard error response
    res.status(400).send({
      error: {
        message: err.message,
      },
    });
  
    return next(err);
  };