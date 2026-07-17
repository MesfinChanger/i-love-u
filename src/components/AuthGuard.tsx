if (checking) {

    return (

      <div className="p-6 text-lg">

        🔐 Verifying Identity...

      </div>

    );

  }


  return <>{children}</>;

}