import { FC, PropsWithChildren, ReactElement } from "react";

const AuthTemplate: FC<PropsWithChildren> = ({ children }): ReactElement => {
  return (
    <section className="flex w-full h-screen bg-primary items-center justify-center">
      {children}
    </section>
  );
};

export default AuthTemplate;
